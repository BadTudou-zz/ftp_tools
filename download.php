<?php
/*
	Copyright © BadTudou, 2016
	All rights reserved

	Name	:	download.php
	By		:	BadTudou
	Date	:	2016年03月26日
	Note	:	实现文件下载功能
*/
	if (isset($_REQUEST['downloadfile']))
	{
		$filename = $_REQUEST['file'];
		$ext = substr($filename, strripos($filename, '.')+1);
		echo $ext;
		echo $filename;
		$file = $_REQUEST['downloadfile']; 
		//文件的类型 
		header('Content-type: application/'.$ext); 
		//下载显示的名字 
		header('Content-Disposition: attachment; filename="'.$filename.'"');
		readfile($file); 
		unlink($file);
		exit(); 
	}
?>