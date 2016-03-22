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
					<a href="#" title="根目录"><img src="images/home.png"/></a>
				</div>
				<div id="folderList_header_path">
				</div>
				<div id="folderList_header_back">
					<a href="#" title="上一级"><img src="images/left.png" style="width: 40px" /></a>
				</div>
				<div id="folderList_header_toolbar">
						<a href="#"><img src="images/upload.png"><span>上传</span></a>
						<a href="#"><img src="images/newfile.png"><span>新建文件</span></a>
						<a href="#"><img src="images/newfolder.png"><span>新建文件夹</span></a>
				 </div>

			</div>
			<div id="folderList_body">
				<ul id="folerviewlist"></ul>
			</div>
		</div>
	</div>

	
</body>
</html>