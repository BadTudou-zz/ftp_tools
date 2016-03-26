<?php
	namespace badtudou;
	require_once('LIB.php');
	class FTP
	{
		protected $m_host;
		protected $m_port;
		protected $m_user;
		protected $m_pwd;
		protected $m_resource;
		protected $m_ConnectState;
		protected $m_LoginState;

		public function __construct($host, int $port, $user, $pwd)
		{
			$this->m_host = $host;
			$this->m_port = $port;
			$this->m_user = $user;
			$this->m_pwd  = $pwd;
			$this->m_ConnectState = false;
			$this->m_LoginState = false;
		}

		/**
		 * [析构函数，释放FTP资源]
		 */
		public function __destruct()
		{
			if ($this->getLoginState())
			{
				ftp_close($this->m_resource);
			}
		}

		/**
		 * [连接FTP服务器,成功则将连接状态设置为true]
		 */
		public function connect()
		{
			$this->m_resource = @ftp_connect($this->m_host, $this->m_port);
			if ($this->m_resource)
			{
				$this->m_ConnectState = true;
			}
		}

		/**
		 * [登录FTP用户，若成功则将登录状态设置为true]
		 */
		public function login()
		{
			try
			{
				if ( @ftp_login($this->m_resource, $this->m_user, $this->m_pwd) )
				{
					$this->m_LoginState = true;
				}
			}
			catch(Exception $e)
			{
				throw new Exception("Error Processing Request", 1);
			}
		}

		/**
		 * [关闭FTP连接，并将连接状态设置为false]
		 */
		public function close()
		{
			ftp_close($this->m_resource);
			$this->m_LoginState = false;
		}

		/**
		 * [登录FTP用户，成功则创建会话 Cookie 索引文件，否则向客户端输出错误信息]
		 */
		public function loginCheck()
		{
			$this->connect();
			if ($this->getConnectState())
			{
				$this->login();
				if ($this->getLoginState())
				{
					SendAnswer(0 , 'manage.php');
					session_start();
					CreateSession($this);
					$this->close();
				}
				else
				{
					SendAnswer(2 , 'FTP用户名或密码错误');
				}
			}
			else
			{
				SendAnswer(1 , '无法连接FTP服务器');
			}
		}

		/**
		 * [获取连接状态]
		 * @return [bool] [true:已连接; false:未连接]
		 */
		public function getConnectState()
		{
			return $this->m_ConnectState;
		}

		/**
		 * [获取登录状态]
		 * @return [bool] [true:已登录; false:未登录]
		 */
		public function getLoginState()
		{
			return $this->m_LoginState;
		}

		/**
		 * [获取FTP主机地址]
		 * @return [string] [FTP主机地址]
		 */
		public function getHost()
		{
			return $this->m_host;
		}

		/**
		 * [获取FTP端口]
		 * @return [int] [FTP端口]
		 */
		public function getPort()
		{
			return $this->m_port;
		}

		/**
		 * [获取FTP用户名]
		 * @return [string] [FTP用户名]
		 */
		public function getUser()
		{
			return $this->m_user;
		}

		/**
		 * [获取FTP密码]
		 * @return [string] [FTP密码]
		 */
		public function getPWD()
		{
			return $this->m_pwd;
		}

		/**
		 * [获取指定路径下的文件列表]
		 * @param  [string] $path [路径]
		 * @return [array]       [文件列表数组]
		 */
		public function getFileList($path)
		{
			return ftp_nlist($this->m_resource, $path);
		}

		/**
		 * [将指定路径为设置为FTP当前目录]
		 * @param  [string] $path [路径]
		 * @return [bool]       [true：成功; false:失败]
		 */
		public function changeDir($path)
		{
			return @ftp_chdir($this->m_resource, $path);
		}

		/**
		 * [获取指定文件的大小]
		 * @param  [string] $file [文件的完整路径]
		 * @return [int]       [文件的字节数]
		 */
		public function getFileSize($file)
		{
			return  ftp_size($this->m_resource, $file);
		}

		/**
		 * [在指定路径下创建文件夹]
		 * @param  [string] $path   [路径]
		 * @param  [string] $folder [文件夹名]
		 * @return [bool]         [true:成功; false:失败]
		 */
		public function createFolder($path, $folder)
		{
			if ($this->changeDir($path))
			{
				if (ftp_mkdir($this->m_resource, $folder))
				{
					return true;
				}
			}
			else
			{
				return false;
			}
		}

		/**
		 * [在指定路径下创建文件]
		 * @param  [string] $path   [路径]
		 * @param  [string] $file [文件名]
		 * @return [bool]         [true:成功; false:失败]
		 */
		public function createFile($path, $file)
		{
			if ($this->changeDir($path))
			{
				fopen($file, 'w+');
				if ( @ftp_nb_put($this->m_resource, $file, $file,  FTP_ASCII) == FTP_FINISHED)
				{
					unlink($file);
					return true;
				}
				else
				{
					unlink($file);
					return false;
				}
			}
		}

		/**
		 * [删除指定路径的文件]
		 * @param  [string] $file [文件路径]
		 * @return [bool]         [true:成功; false:失败]
		 */
		public function deleteFile($file)
		{
			return ftp_delete($this->m_resource, $file);
		}

		/**
		 * [将目录索引写入以"hostname"组成的json文件，host中的.以_代替]
		 */
		public function writeIndex()
		{
			$filename = 'index/'.str_replace('.','_',$this->m_host).$this->m_user.'.json';
			fopen($filename,'w+');
			$files = $this->getFileList('/');
			array_splice($files,array_search('.', $files),1);
			array_splice($files,array_search('..', $files),1);
			file_put_contents($filename, json_encode($files));
		}

		/**
		 * [文件重命名]
		 * @param [string] $path       [路径]
		 * @param [string] $file       [文件/文件夹]
		 * @param [string] $oldname    [旧的文件名/文件夹名]
		 * @param [string] $newname    [新的文件名/文件夹名]
		 * @return [bool]         [true:成功; false:失败]
		 */
		public function rename($path, $oldname, $newname)
		{
			if ($this->changeDir($path))
			{
				return ftp_rename($this->m_resource, $oldname, $newname);
			}

			return false;
		}

		public function downloadFile($remotefile, $localfile)
		{
			$ret = ftp_nb_get($this->m_resource, $localfile, $remotefile, FTP_ASCII);
			while ($ret == FTP_MOREDATA)
			{
				$ret = ftp_nb_continue ($this->m_resource);
			}
			if ($ret != FTP_FINISHED)
			{
				return false;
			}

			return true;
		}
	}


?>