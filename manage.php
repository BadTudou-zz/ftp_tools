<!--
		Copyright © BadTudou, 2016
		All rights reserved

		Name	:	manage.php
		By		:	BadTudu
		Date	:	2016年3月18日13:54:05
		Note	:	FTP文件管理页面
-->
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<link rel="stylesheet" type="text/css" href="css/jqtree/jqtree.css">
	<link rel="stylesheet" type="text/css" href="css/manage-style.css">
	<script type="text/javascript" src="js/jquery-2.2.1.min.js"></script>
	<script type="text/javascript" src="js/tree.jquery.js"></script>
	<script type="text/javascript" src="js/manage.js"></script>
	<title>管理</title>
</head>
<body>
	<div id="header">
		<div id="header_userinfo">
			<div id="header_userinfo_head"> <img  src="images/user.png"> </div>
			<div id="header_userinfo_loginstate">
				<div id="header_userinfo_name"></div>
				<div id="header_userinfo_state"></div>
			</div>
		</div>
	</div>

	<div id="folder">
		<div id="folderTree"></div>
		<div id="folderList">
			<div id="folderList_header">
				<div id="folderList_header_logo">
					<img src="images/home.png">
				</div>
				<div id="folderList_header_path">
				</div>
				<div id="folderList_header_toolbar">工具栏</div>
			</div>
			<div id="folderList_body">
				<ul id="folerviewlist"></ul>
			</div>
		</div>
	</div>

	
</body>
</html>