<!--
	Copyright © DuZhongHai, 2016
	All rights reserved

	Name	:	web_manage.php
	By		:	BadTudou
	Date	:	2016年3月2日22:08:01
	Note	:	
-->
<!--
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
	<link rel="stylesheet" type="text/css" href="css/web-manage-style.css">
</head>
<body>
	<div id="header">
		首部
	</div>
	<div id="folder">
		<div id="folderTree">
			文件树
		</div>
		<div id="folderList">
			文件列表
		</div>
	</div>
-->
	<?php
		header('Content-type: text/json');
		define('DEBUG', true);
		if (defined('DEBUG'))
		{
			error_reporting(0);
		}
		
		$ftp_host = $_POST['ftp_host'];
		$ftp_port = intval($_POST['ftp_port']);
		$ftp_user = $_POST['ftp_user'];
		$ftp_pwd  = $_POST['ftp_pwd'];
		
		try
		{
			$conn = ftp_connect($ftp_host, $ftp_port, 1);
			if (!$conn)
			{
				$aLoginResult['state'] = 1;
				//$aLoginResult['msg'] = '无法连接FTP服务器';
			}
		}
		catch(Exception $e)
		{
			throw new Exception();
		}

		if ( @ftp_login($conn ,$ftp_user, $ftp_pwd))
		{
			$aLoginResult['state'] = 0;
			//$aLoginResult['msg'] = '登陆成功';
			$directory_root = ftp_pwd($conn);
    		$directory = ftp_nlist($conn, '');
    		
    		foreach ($directory as $key => $value) 
    		{
    			echo "ftp://{$ftp_host}{$directory_root}/{$value}<br/>";
    		}
		}
		else 
		{
    		$aLoginResult['state'] = 2;
    		//$aLoginResult['msg'] = '无法登陆';
		}

		// 关闭连接
		if ($conn != null)
		{
			ftp_close($conn);  
		}
		echo json_encode($aLoginResult);
		//echo 'this is a test';
	?>
<!--</body>
//</html>
-->