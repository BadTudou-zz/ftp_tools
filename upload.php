<?php
/*
		Copyright © BadTudou, 2016
		All rights reserved

		Name	:	manage.php
		By		:	BadTudu
		Date	:	2016年3月18日13:54:05
		Note	:	FTP文件管理页面
*/
	require_once('LIB.php');
	header("Content-type: text/html; charset=utf-8"); 
	session_start();
	$filecount = count($_FILES['files']['name']);
	for ($i=0; $i < $filecount; $i++)
	{
		$name = $_FILES['files']['name'][$i];
		$tmp_name = $_FILES['files']['tmp_name'][$i];
		move_uploaded_file($tmp_name, 'upload/'.iconv("UTF-8", "gb2312", session_id().$name));
	}
	echo 'true';

?>