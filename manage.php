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
	<link rel="stylesheet" type="text/css" href="css/jquery.fileupload.css">
	<link rel="stylesheet" type="text/css" href="css/ui-dialog.css">
	<script type="text/javascript" src="js/jquery-2.2.1.min.js"></script>
	<script type="text/javascript" src="js/vendor/jquery.ui.widget.js"></script>
	<script type="text/javascript" src="js/jquery.iframe-transport.js"></script>
	<script type="text/javascript" src="js/jquery.fileupload.js"></script>
	<script type="text/javascript" src="js/jquery.fileupload-ui.js"></script>
	<script type="text/javascript" src="js/jquery.fileupload-process.js"></script>
	<script type="text/javascript" src="js/dialog-min.js"></script>
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
						<a id="folderList_header_toolbar_upload" href="#" ><img  src="images/upload.png"><span>上传</span></a>
						<a id="folderList_header_toolbar_newfile" href="#"><img  src="images/newfile.png"><span>新建文件</span></a>
						<a id="folderList_header_toolbar_newfolder" href="#"><img  src="images/newfolder.png"><span>新建文件夹</span></a>
				 </div>

			</div>
			<div id="folderList_opeate">
				<div id="folderList_opeate_upload">
					<input id="fileupload" type="file" name="files[]" data-url="server/php/" hidden multiple/form-data>
					<button type="submit" value="开始">
                	    开始
                	</button>
                	<button type="submit">
                	    取消
                	</button>
                	<button type="submit">
                	    删除
                	</button>
                	<div id="test"></div>
                </div>
			</div>
			<div id="folderList_body">
				<ul id="folerviewlist"></ul>
			</div>
		</div>
	</div>

	
</body>
</html>