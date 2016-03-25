<?php
/*
	Copyright © BadTudou, 2016
	All rights reserved

	Name	:	web_login.php
	By		:	BadTudu
	Date	:	2016年3月18日13:54:05
	Note	:	FTP登陆后台处理
*/
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

	require_once('FTP.php');
	use badtudou\FTP as FTP;

	define('DEBUG', true);
	if (!defined('DEBUG'))
	{
		error_reporting(0);
	}

	if (!isset($_POST['ftp_host']))
	{
		header("Location: http:index.php"); 
		exit();
	}
	
	$ftp_host = $_POST['ftp_host'];
	$ftp_port = intval($_POST['ftp_port']);
	$ftp_user = $_POST['ftp_user'];
	$ftp_pwd  = $_POST['ftp_pwd'];
	$ftp_info = new FTP($ftp_host, $ftp_port, $ftp_user, $ftp_pwd);

	$ftp_info->connect();
	if ($ftp_info->getConnectState())
	{
		$ftp_info->login();
		if ($ftp_info->getLoginState())
		{
			
			sendAnswer(0 , 'manage.php');

			//创建会话
			session_start();
			$_SESSION['ftp_login'] = true;
			$_SESSION['ftp_host'] = $ftp_host;
			$_SESSION['ftp_port'] = $ftp_port;
			$_SESSION['ftp_user'] = $ftp_user;
			$_SESSION['ftp_pwd'] = $ftp_pwd;
			
			//FTP信息写入cookie
			setcookie('ftp_cookie[0]', $ftp_host,  time()+3600*24);
			setcookie('ftp_cookie[1]', $ftp_port,  time()+3600*24);
			setcookie('ftp_cookie[2]', $ftp_user,  time()+3600*24);
			setcookie('ftp_cookie[3]', $ftp_pwd,  time()+3600*24);

			//读取FTP文件列表，并写入SESSION
			$filename = 'index/'.str_replace('.','_',$ftp_host).$ftp_user.'.json';
			fopen($filename,'w+');
			$files = $ftp_info->getFileList('/');
			array_splice($files,array_search('.', $files),1);
			array_splice($files,array_search('..', $files),1);
			file_put_contents($filename, json_encode($files));
			//fwrite($fJson, json_encode($ftp_info->getFileList('/')));
			$ftp_info->close();
		}
		else
		{
			sendAnswer(2 , 'FTP用户名或密码错误');
		}
	}
	else
	{
		sendAnswer(1 , '无法连接FTP服务器');
	}
	
?>
