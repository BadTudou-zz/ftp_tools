<?php

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
			$ftp_info->close();
			sendAnswer(0 , 'filemanage.php');

			//创建会话
			session_start();
			$_SESSION['ftp_login'] = true;

			//FTP信息写入cookie
			setcookie('ftp_cookie[0]', $ftp_host);
			setcookie('ftp_cookie[1]', $ftp_port);
			setcookie('ftp_cookie[2]', $ftp_user);
			setcookie('ftp_cookie[3]', $ftp_pwd);
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
