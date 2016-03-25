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
	 	* [向客服端发送json格式的状态数据]
		* @param  [int] $state [状态码] , 0成功， 非0为错误
		* @param  [int] $msg   [消息]   , 状态码为0访问要跳转的页面地址
	 	* @return [null]
	 	*/
		function sendAnswer(int $state, $msg)
		{
			$aLoginResult['state'] = $state;
			$aLoginResult['msg'] = $msg;
			echo json_encode($aLoginResult);
		}

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
					echo GetFileList($ftpManage, $_POST['file']);
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
				/*case 'ChangeDir':
					ChangeDir($ftpManage, $_POST['path']);
					break;*/

				default:
					# code...
					break;
			}
		}

		function Login(&$ftpManage)
		{

			$ftpManage->connect();
			$ftpManage->login();

			//读取文件，并将其写入json中
			

		}

		function GetPWD(&$ftpManage)
		{
			sendAnswer(0, $ftpManage->getPWD());
		}

		function GetFileIndex()
		{
			$filename = 'index/'.str_replace('.','_',$_SESSION['ftp_host'].$_SESSION['ftp_user']).'.json';
			echo file_get_contents($filename);
		}
		/*function WriteToIndex()
		{
			$filename = 'index/'.str_replace('.','_',$ftp_host).$ftp_user.'.json';
			fopen($filename,'w+');
			$files = $ftp_info->getFileList('/');
			array_splice($files,array_search('.', $files),1);
			array_splice($files,array_search('..', $files),1);
			file_put_contents($filename.".json", json_encode($files));
		}*/
		function GetFileList(&$ftpManage, $file)
		{
			Login($ftpManage);
			$files = $ftpManage->getFileList($file);
			array_splice($files,array_search('.', $files),1);
			array_splice($files,array_search('..', $files),1);
			return json_encode($files);
		}

		function CreateFolder(&$ftpManage, $path, $folder)
		{
			Login($ftpManage);
			if ($ftpManage->createFolder($_POST['path'], $_POST['folder']))
			{
				sendAnswer(0, 'ok');
			}
			else
			{
				sendAnswer(1, 'error');
			}
		}

		function CreateFile(&$ftpManage, $path, $file)
		{
			Login($ftpManage);
			if ($ftpManage->createFile($_POST['path'], $_POST['file']))
			{
				sendAnswer(0, 'ok');
			}
			else
			{
				sendAnswer(1, 'error');
			}
		}

		function UploadFile(&$ftpManage, $path)
		{
			 echo json_encode(print_r($_FILES["files"]));
		}

		function DeleteFile(&$ftpManage, $path, $file)
		{
			Login($ftpManage);
			if ($ftpManage->deleteFile($path. $file))
			{
				sendAnswer(0, '删除成功');
			}
			else
			{
				sendAnswer(1, '删除失败');
			}
		}

		session_start();
		//登录状态检查
		if ( !(isset($_SESSION['ftp_login']) && $_SESSION['ftp_login'] === true) )
		{
			sendAnswer(1, 'index.php');
			exit();
		}
		$ftpManage = new FTP($_SESSION['ftp_host'], $_SESSION['ftp_port'], $_SESSION['ftp_user'], $_SESSION['ftp_pwd']);

		//
		if (isset($_POST['action']))
		{
			//Login($ftpManage);
			DisposeAction($_POST['action'], $ftpManage);
		}
	?>