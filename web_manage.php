<?php
/*
	Copyright © BadTudou, 2016
	All rights reserved

	Name	:	web_manamege.php
	By		:	BadTudu
	Date	:	2016年3月18日13:54:05
	Note	:	FTP文件管理后台处理
*/
		require_once('FTP.php');
		use badtudou\FTP as FTP;

		define('DEBUG', true);
		if (!defined('DEBUG'))
		{
			error_reporting(0);
		}

		
		/**
		 * [分发处理客服端的action]
		 * @param [type] $action     [客服端的请求]
		 * @param [type] &$ftpManage [FTP对象]
		 */
		function DisposeAction($action, &$ftpManage)
		{

			switch ($action)
			{
				case 'GetFileIndex':
					GetFileIndex();
					break;

				case 'Login':
					sendAnswer(0, $_SESSION['ftp_user']);
					break;

				case 'GetFileList':
					GetFileList($ftpManage, $_POST['file']);
					break;

				case 'CreateFolder':
					CreateFolder($ftpManage, $_POST['path'], $_POST['folder']);
					break;

				case 'CreateFile':
					CreateFile($ftpManage, $_POST['path'], $_POST['file']);
					break;

				case 'UploadFile':
					UploadFile($ftpManage, $_POST['path']);
					break;

				case 'delete':
					DeleteFile($ftpManage, $_POST['path'], $_POST['file']);
					break;

				case 'rename':
					RenameFile($ftpManage, $_POST['path'], $_POST['file'], $_POST['newname']);
					break;

				case 'download':
					$filepath = 'tmp/'.str_replace('.','_',$ftpManage->getHost()).$ftpManage->getUser().$_POST['file'];
					DownloadFile($ftpManage, $_POST['path'], $_POST['file'], $filepath);
				/*case 'ChangeDir':
					ChangeDir($ftpManage, $_POST['path']);
					break;*/

				default:
					# code...
					break;
			}
		}

		function UploadFile(&$ftpManage, $path)
		{
			 echo json_encode(print_r($_FILES["files"]));
		}

		session_start();
		//登录状态检查
		if ( !(isset($_SESSION['ftp_login']) && $_SESSION['ftp_login'] === true) )
		{
			sendAnswer(1, 'index.php');
			exit();
		}
		$ftpManage = new FTP($_SESSION['ftp_host'], $_SESSION['ftp_port'], $_SESSION['ftp_user'], $_SESSION['ftp_pwd']);

		if (isset($_POST['action']))
		{
			DisposeAction($_POST['action'], $ftpManage);
		}
	?>