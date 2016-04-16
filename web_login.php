<?php
/*
	Copyright © BadTudou, 2016
	All rights reserved

	Name	:	web_login.php
	By		:	BadTudu
	Date	:	2016年3月18日13:54:05
	Note	:	FTP登陆后台处理
*/

	require_once('FTP.php');
	use badtudou\FTP as FTP;

	define('DEBUG', true);
	if (!defined('DEBUG'))
	{
		error_reporting(0);
	}

	//未提交登录表单
	if (!isset($_POST['ftp_host']))
	{
		header("Location: http:index.php"); 
		exit();
	}
	if (!isset($_SESSION))
	{
		session_start();
	}

	$ftp_host = $_POST['ftp_host'];
	$ftp_port =  (int)$_POST['ftp_port'];
	$ftp_user = $_POST['ftp_user'];
	$ftp_pwd  = $_POST['ftp_pwd'];
	$ftpManage = new FTP($ftp_host, $ftp_port, $ftp_user, $ftp_pwd);
	$ftpManage->loginCheck();
	session_write_close();
?>
