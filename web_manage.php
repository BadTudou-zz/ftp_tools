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
				case 'Login':
					if ($ftpManage->getLoginState())
					{
						sendAnswer(0, $ftpManage->getUser());
					}
					else
					{
						sendAnswer(1, '离线');
					}
					break;
				
				case 'GetPWD':
					GetPWD($ftpManage);
					break;
				default:
					# code...
					break;
			}
		}

		function Login(&$ftpManage)
		{

			$ftpManage->connect();
			$ftpManage->login();

		}

		function GetPWD(&$ftpManage)
		{
			//sendAnswer(0,$ftpManage->m_resource);
			sendAnswer(0, $ftpManage->getPWD());
		}

		session_start();
		//登录状态检查
		if ( !(isset($_SESSION['ftp_login']) && $_SESSION['ftp_login'] === true) )
		{
			sendAnswer(1, '123123index.php');
			exit();
		}
		$ftpManage = new FTP($_SESSION['ftp_host'], $_SESSION['ftp_port'], $_SESSION['ftp_user'], $_SESSION['ftp_pwd']);

		if (isset($_POST['action']))
		{
			Login($ftpManage);
			DisposeAction($_POST['action'], $ftpManage);
		}
	?>