<?php
		/**
	 	* [向客服端发送json格式的状态数据]
		* @param  [int] $state [状态码]
		* @param  [int] $msg   [消息]
	 	* 注意：状态码0为成功， 非0为错误
	 	*/
		function SendAnswer(int $state, $msg)
		{
			$aLoginResult['state'] = $state;
			$aLoginResult['msg'] = $msg;
			echo json_encode($aLoginResult);
		}

		/**
		 * [创建用户会话，并将其信息写入cookie，做初始化工作]
		 * @param  [object] &$ftpManage [description]
		 */
		function CreateSession(&$ftpManage)
		{
			$vHost = $ftpManage->getHost();
			$vPort = $ftpManage->getPort();
			$vUser = $ftpManage->getUser();
			$vPWD  = $ftpManage->getPWD();
			$vRoot = $ftpManage->getCurrentPath();

			if (!isset($_SESSION))
			{
				session_start();
			}
			$_SESSION['ftp_login'] = true;
			$_SESSION['ftp_host']  = $vHost;
			$_SESSION['ftp_port']  = $vPort;
			$_SESSION['ftp_user']  = $vUser;
			$_SESSION['ftp_pwd']   = $vPWD;
			$_SESSION['ftp_root']  = $vRoot;

			//FTP信息写入cookie
			$timeOut = time()+3600*24;
			setcookie('ftp_cookie[0]', $vHost,  $timeOut);
			setcookie('ftp_cookie[1]', $vPort,  $timeOut);
			setcookie('ftp_cookie[2]', $vUser,  $timeOut);
			setcookie('ftp_cookie[3]', $vPWD,  $timeOut);
			setcookie('ftp_cookie[4]', $vRoot,  $timeOut);
		}

		/**
		 * [连接并登录FTP服务器，并将文件列表写入索引文件]
		 * @param [object] &$ftpManage [FTP对象]
		 */
		function Login(&$ftpManage)
		{
			$ftpManage->connect();
			$ftpManage->login();
		}

		/**
		 * [向客户端输出特定路径下的文件列表]
		 * @param [object] &$ftpManage [FTP对象]
		 * @param [string] $path       [要获取的路径]
		 */
		function GetFileList(&$ftpManage, $path)
		{
			Login($ftpManage);
			$size = strlen($path);
			$files = $ftpManage->getFileList($path);
			natsort($files);
			$i = 0;
			foreach ($files as $key => $value)
			{
				$fronfile = substr($value, 0, $size);
				if ( strcmp($fronfile,$path) == 0)
				{
					$files[$key] = substr($value,$size);
				}
				if (strcmp($value,'.') == 0 || strcmp($value,'..') == 0)
				{
					array_splice($files, $i,1);
					$i--;
				}
				$i++;
			}

			echo json_encode($files);
		}

		/**
		 * [在指定的路径下创建一个文件夹，并向客户端输出状态消息]
		 * @param [type] &$ftpManage [FTP对象]
		 * @param [type] $path       [指定的路径]
		 * @param [type] $folder     [文件夹名]
		 *         状态 	状态码 	    消息
		 *         成功		  0			ok
		 *         失败		  1			error
		 */
		function CreateFolder(&$ftpManage, $path, $folder)
		{
			Login($ftpManage);
			if ($ftpManage->createFolder($_POST['path'], $_POST['folder']))
			{
				SendAnswer(0, 'ok');
			}
			else
			{
				SendAnswer(1, 'error');
			}
		}

		/**
		 * [在指定的路径下创建一个文件，并向客户端输出状态消息]
		 * @param [type] &$ftpManage [FTP对象]
		 * @param [type] $path       [指定的路径]
		 * @param [type] $file       [文件名]
		 *         状态 	状态码 	    消息
		 *         成功		  0			ok
		 *         失败		  1			error
		 */
		function CreateFile(&$ftpManage, $path, $file)
		{
			Login($ftpManage);
			if ($ftpManage->createFile($_POST['path'], $_POST['file']))
			{
				SendAnswer(0, 'ok');
			}
			else
			{
				SendAnswer(1, 'error');
			}
		}

		/**
		 * [在指定的路径下删除一个文件，并向客户端输出状态消息]
		 * @param [type] &$ftpManage [FTP对象]
		 * @param [type] $path       [指定的路径]
		 * @param [type] $file       [文件名]
		 *         状态 	状态码 	    消息
		 *         成功		  0			ok
		 *         失败		  1			error
		 */
		function DeleteFile(&$ftpManage, $path, $file)
		{
			Login($ftpManage);
			if ($ftpManage->deleteFile($path. $file))
			{
				SendAnswer(0, '删除成功');
			}
			else
			{
				SendAnswer(1, '删除失败');
			}
		}

		/**
		 * [文件/文件夹重命名]
		 * @param [string] &$ftpManage [FTP对象]
		 * @param [string] $path       [路径]
		 * @param [string] $file       [文件/文件夹]
		 * @param [string] $newname    [新的文件名/文件夹名]
		 */
		function RenameFile(&$ftpManage, $path, $file, $newname)
		{
			Login($ftpManage);
			if ($ftpManage->rename($path, $file, $newname))
			{
				SendAnswer(0, '重命名成功');
			}
			else
			{
				SendAnswer(1, '重命名失败');
			}
		}

		/**
		 * [客户端处理下载文件]
		 * @param [object] &$ftpManage [FTP对象]
		 * @param [string] $path       [文件路径]
		 * @param [string] $file       [文件名]
		 * @param [string] $localfile  [本地临时文件名(含路径)]
		 */
		function DownloadFile(&$ftpManage, $path, $file, $localfile)
		{
			Login($ftpManage);
			if ($ftpManage->downloadFile($path.$file, $localfile))
			{
				$fileurl = 'download.php?file='.$file.'&downloadfile='.$localfile;
				SendAnswer(0, $fileurl);
			}
			else
			{
				SendAnswer(1, '下载失败');
			}
		}

		/**
		 * [上传文件至FTP服务器]
		 * @param [object] &$ftpManage [FTP对象]
		 * @param [string] $path       [本地文件路径]
		 */
		function UploadFile(&$ftpManage, $path)
		{
			Login($ftpManage);
			$len = strlen(session_id());
			$rDir = opendir('upload/');
			error_log('sessionid leng'.$len);
			while (($sFile = readdir($rDir)) != null)
			{
				$sessionId = substr($sFile, 0, $len);
				if (strcmp($sessionId, session_id()) == 0)
				{
					$fileName = substr($sFile,$len);
					if ($ftpManage->uploadFile($path.$fileName, dirname(__FILE__).'/upload/'.$sFile))
					{
						unlink('upload/'.$sFile);
					}
				}
			}
			SendAnswer(0, '上传成功');
		}

?>