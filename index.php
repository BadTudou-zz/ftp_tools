<!--
	Copyright © DuZhongHai, 2016
	All rights reserved

	Name	:	manage.php
	By		:	BadTudou
	Date	:	2016年3月2日12:49:12
	Note	:	
-->

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>PHP作业管理</title>
	<link rel="stylesheet" type="text/css" href="css/manage-style.css">
	<script type="text/javascript" src="js/jquery-2.2.1.min.js"></script>
	<script type="text/javascript" src="js/jquery.cookie.js"></script>
	<script type="text/javascript" src="js/manage.js"></script>
</head>
<body>
	<div id="logo">
		<img src="images/mega.png" width="160px" height="160px">
	</div>
	<div id="ftp_section">
		<form action="web_manage.php" id="ftp_info" method="POST">
			<p id="hintText" class="hintOk">登陆FTP服务器</p>
			<p><input type="text" id="ftp_host" name="ftp_host" placeholder="域名/IP地址"></input></p>
			<p><input type="text" id="ftp_port" name="ftp_port" placeholder="端口"></input></p>
			<p><input type="text" id="ftp_user" name="ftp_user" placeholder="用户名"></input></p>
			<p><input type="password" id="ftp_pwd" name="ftp_pwd" placeholder="密码"></input></p>
			<p><input type="submit" id="submit_button" class="submit_buttonError" value="立即登陆" disabled="true"></input></p>
		</form>
	</div>
</body>
</html>