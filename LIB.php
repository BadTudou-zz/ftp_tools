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
		 * @param  [type] &$ftpManage [description]
		 * @return [type]             [description]
		 */
		function CreateSession(&$ftpManage)
		{
			$vHost = $ftpManage->getHost();
			$vPort = $ftpManage->getPort();
			$vUser = $ftpManage->getUser();
			$vPWD  = $ftpManage->getPWD();

			$_SESSION['ftp_login'] = true;
			$_SESSION['ftp_host']  = $vHost;
			$_SESSION['ftp_port']  = $vPort;
			$_SESSION['ftp_user']  = $vUser;
			$_SESSION['ftp_pwd']   = $vPWD;

			//FTP信息写入cookie
			$timeOut = time()+3600*24;
			setcookie('ftp_cookie[0]', $vHost,  $timeOut);
			setcookie('ftp_cookie[1]', $vPort,  $timeOut);
			setcookie('ftp_cookie[2]', $vUser,  $timeOut);
			setcookie('ftp_cookie[3]', $vPWD,  $timeOut);

			//读取FTP文件列表，并写入配置文件
			$ftpManage->writeIndex();
		}

		/**
		 * [连接并登录FTP服务器，并将文件列表写入索引文件]
		 * @param [type] &$ftpManage [FTP对象]
		 */
		function Login(&$ftpManage)
		{
			$ftpManage->connect();
			$ftpManage->login();
			$ftpManage->writeIndex();
		}

		/**
		 * [向客户端输出文件索引]
		 */
		function GetFileIndex()
		{
			$filename = 'index/'.str_replace('.','_',$_SESSION['ftp_host'].$_SESSION['ftp_user']).'.json';
			echo file_get_contents($filename);
		}

		/**
		 * [向客户端输出特定路径下的文件列表]
		 * @param [type] &$ftpManage [FTP对象]
		 * @param [type] $path       [要获取的路径]
		 */
		function GetFileList(&$ftpManage, $path)
		{
			Login($ftpManage);
			$files = $ftpManage->getFileList($path);
			array_splice($files,array_search('.', $files),1);
			array_splice($files,array_search('..', $files),1);
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

		function DownloadFile(&$ftpManage, $path, $file, $localfile)
		{
			Login($ftpManage);
			if ($ftpManage->downloadFile($path.$file, $localfile))
			{
				//$ext = substr($file, strripos($file, '.')+1);
				//$fileurl = 'http://'.dirname($_SERVER['SCRIPT_NAME$localfile;
				//header('Content-type: application/'.$ext);
				//header('Content-Disposition: attachment; filename="'.$file);
				//readfile($localfile);
				//Header('Location:'.$fileurl);*/
				
				SendAnswer(0, $localfile);
			}
			else
			{
				SendAnswer(1, '下载失败');
			}
		}


?>