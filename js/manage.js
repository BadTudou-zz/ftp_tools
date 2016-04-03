/*
		Copyright © BadTudou, 2016
		All rights reserved

		Name	:	manage.js
		By		:	BadTudu
		Date	:	2016年3月18日13:54:05
		Note	:	FTP文件管理的JQuery脚本
*/
var gRootPath;

/**
 * [ext是否说支持显示图标的文件类型]
 * @param {[string]} ext [扩展名]
 * @return [bool]         [true:是; false:否]
 */
function IsFileType(ext)
{
	var data = new Array('txt','php', 'html', 'exe');
	for (var i =0; i <data.length ; i++)
	{
		if (data[i] == ext)
		{
			return true;
		}
	}

	return false;
}

/**
 * [向服务器的web_manage.php发送POST请求，返回JSON]
 * @param {[json]} data     [发送的请求]
 */
function SendRequest(data)
{
	$.ajax(
	{
		url: 'web_manage.php',
		type: 'POST',
		dataType: 'JSON',
		data:data
	})

	.done(function(json)
	{
		console.log('send requset'+json.msg);
		return json.msg;
	})

	.error(function()
	{
		return false;
	})

}

/**
 * [移除指定节点的所有子节点]
 * @param {[type]} node [节点]
 */
function RemoveAllChilds(node)
{
	while (node.children.length != 0)
     {
     	for (var i=0; i < node.children.length; i++)
     	{
    		$('#folderTree').tree('removeNode', node.children[i]);
		}
     }
}

/**
 * [初始化文件树]
 * @param {string} rootPath [根目录]
 */
function InitTree()
{
	var data = [{label:GetRootPath(), id:1}];
	var $tree = $('#folderTree');
	$tree.tree({data:data, autoOpen: true});
	GetFileList('#folderTree', GetRootPath(), GetTreeRoot());
}

/**
 * [获取当前路径]
 * @return {string}  [当前路径]
 */
function GetCurrentPath()
{
	return $('#folderList_header_path').text();
}

/**
 * [设置当前路径]
 * @param {[string]} path [路径]
 */
function SetCurrentPath(path)
{
	$('#folderList_header_path').text(path);
}


/**
 * [获取根路径]
 * @return {string}  [根路径]
 */
function GetRootPath()
{
	return gRootPath;
}

/**
 * [设置根路径]
 * @param {[string]} rootPath [根路径]
 */
function SetRootPath(rootPath)
{
	gRootPath = rootPath;
}

function GetTreeRoot()
{
	var treeRoot = $('#folderTree').tree('getNodeById', 1);
	return treeRoot;
}

/**
 * [登陆]
 */
function Login()
{
	$.ajax({
		url: 'web_manage.php',
		type: 'POST',
		dataType: 'JSON',
		data: {'action':'Login'}
	})

	.done(function(json)
	{
		if (json.state == 0)
		{
			var tmpRootPath = json.msg;
			if (tmpRootPath != '/')
			{
				tmpRootPath += '/';
			}
			SetRootPath(tmpRootPath);
			InitTree();
			$("#header_userinfo_head").show();
			$("#header_userinfo_name").html($.cookie('ftp_cookie[2]'));
			$("#header_userinfo_state").text('当前在线').css({color:"#13E03C"});
		}
		else
		{
			location.href = json.msg;
		}
	})
}


/**
 * [设置文件列表]
 * @param {[json]} json [文件列表]
 */
function SetFileList(json)
{
	$('#folerviewlist').empty();
	$.each(json, function(idx, obj)
	{
		var pos = obj.lastIndexOf('.');
		var ext = obj.substr(pos+1);
		if (IsFileType(ext))
		{
			$('#folerviewlist').append('<li style="background-image:url(images/'+ext+'.png); background-repeat: no-repeat;background-size:80px 80px;background-position:center;"><a href="#">'+obj+'</a></li>');
		}
		else
		{
			$('#folerviewlist').append('<li><a href="#">'+obj+'</a></li>');
		}
	})
}

function SetFileTree(json, node)
{
	RemoveAllChilds(node);
	$.each(json, function(idx, obj)
	{
		$('#folderTree').tree('appendNode', obj, node);
	})
}

function GetFileList(object, file, node)
{
	$.ajax({
		url: 'web_manage.php',
		type: 'POST',
		dataType: 'JSON',
		data: {'action':'GetFileList','file':file}
	})
	.done(function(json)
	{
		if ($.isEmptyObject(json))
		{
			console.log('no data of file list');
			if (file.lastIndexOf('.') == -1)
			{
				SetCurrentPath(file);
				$('#folerviewlist').empty();
			}
		}
		else
		{
			SetCurrentPath(file);
			SetFileList(json);
			if (object == '#folderTree')
			{
				SetFileTree(json, node);
			}
		}
	})
	.fail(function(json) 
	{
		console.log("get file list error"+json);
	})
}

function ShowDig(object ,msg)
{
	var path = $('#folderList_header_path').text();
	GetFileList('#folerviewlist', path, 0);
	var d = dialog({
				align: 'bottom',
			    content: msg
				});
	d.show(document.getElementById(object));
	setTimeout(function () 
	{
    	d.close().remove();
	}, 2000);

}
function CreateFolder(path, folder)
{
	$.ajax({
		url: 'web_manage.php',
		type: 'POST',
		dataType: 'JSON',
		data: {'action':'CreateFolder','path':path, 'folder':folder}
	})
	.done(function(json)
	{
		if (json.state == 0)
		{
			ShowDig('folderList_header_toolbar_newfolder','创建文件夹成功');
		}
		else
		{
			ShowDig('folderList_header_toolbar_newfolder','创建文件夹失败');
		}
		return true;
	})
	.fail(function(json) 
	{
		ShowDig('folderList_header_toolbar_newfolder','创建文件夹失败');
		return false;
	})

}

function CreateFile(path, file)
{
	$.ajax(
	{
		url: 'web_manage.php',
		type: 'POST',
		dataType: 'JSON',
		data: {'action':'CreateFile','path':path, 'file':file}
	})
	.done(function(json)
	{
		if (json.state == 0)
		{
			ShowDig('folderList_header_toolbar_newfile','创建文件成功');
		}
		else
		{
			ShowDig('folderList_header_toolbar_newfile','创建文件失败');
		}
		return true;
	})
	.fail(function(json)
	{
		ShowDig('folderList_header_toolbar_newfile','创建文件失败');
		return false;
	})

}

function FileOperate(action, file, args)
{
	var path = $('#folderList_header_path').text();
	switch (action)
	{
		case 'open':
			console.log(path+file);
			return;
			break;

		case 'download':
			console.log('download file'+path+file);
			break;

		case 'delete':
			console.log(path+file);
			break;

		case 'rename':
			console.log(path+file+'new file name'+args);
			break;
	}
	$.ajax({
		url: 'web_manage.php',
		type: 'POST',
		dataType: 'JSON',
		data: {'action':action,'path':path, 'file':file, 'newname':args}
	})
	.done(function(json)
	{
		if (json.state == 0)
		{
			if (action == 'download')
			{
				window.open(json.msg, 'download');
				return true;
			}
			ShowDig('folderList_header', json.msg);
			GetFileList('#folerviewlist', path, 0);

			console.log(json.msg);
		}
	})
	.fail(function(json) {
		console.log("error"+json);
	})
	.always(function() {
		console.log("complete");
	});
}

function ShowContextMenu(object)
{
	var imageMenuData = [
    		 [{
        		text: "打开",
        		func: function()
        		{
            		FileOperate('open', $(this).text(), 0);
        		}
   			 },
    		 {
        		text: "下载",
        		func: function()
        		{
            		FileOperate('download', $(this).text(), 0);
        		}
   			 },
   			  {
        		text: "删除",
        		func: function()
        		{
            		FileOperate('delete', $(this).text(), 0);
        		}
    		},
    		{
        		text: "重命名",
        		func: function()
        		{
        			var file = $(this).text();
        			var newname = null;
        			var d = dialog(
					{
    					title: '新的文件名',
    					align: 'top',
    					content: '<input id="filename" value="'+file+'"autofocus />',
    					okValue: '确定',
    					cancelValue: '取消',
    					ok: function ()
    					{
        					newname = $('#filename').val();
			        		console.log('file'+newname);
			        		FileOperate('rename', file, newname);
        					return true;
    					}
    				});
					d.show(document.getElementById('folderList_header'));
				}
    		}],
		];
		$(object).smartMenu(imageMenuData);
}

$(document).ready(function()
{

	//绑定单击文件树事件
	$('#folderTree').bind
	(
    	'tree.click',
    	function(event)
    	{
        	var node = event.node;
        	var path = new Array();
        	var tmp = node;

        	while(tmp.name != '')
        	{
        		if (tmp.name != gRootPath)
        		{
        			path.push('/');
        		}
        		path.push(tmp.name);
        		tmp = tmp.parent;
        	}

        	path.reverse();
        	var dirname=path.join('');
        	RemoveAllChilds(node);
        	console.log('tree '+dirname);
        	GetFileList('#folderTree', dirname, node);
        	}
	);

	//绑定单击文件预览列表li事件
	$("#folerviewlist").on("click","li", function()
	{
		var Folderpath = $('#folderList_header_path').text();
		var path = Folderpath+$(this).text()+'/';
		GetFileList('#folerviewlist', path, 0);
	});

	$("body").on("contextmenu", 0, function(event)
	{
		event.preventDefault();
	});

	$("#folerviewlist").on("mouseenter","li", function(event)
	{
		//console.log($(this).text());
	});

	$("#folerviewlist").on("contextmenu","li", function(event)
	{
		event.stopPropagation();
		ShowContextMenu($(this));
		return false;
	});
	//绑定单击主页按钮事件
	$('#folderList_header_logo').click(function()
	{
		GetFileList('#folerviewlist', GetRootPath(), 0);
	});
	//绑定单击返回上一级按钮事件
	$('#folderList_header_back').click(function()
	{
		var path = $('#folderList_header_path').text();
		if (path == groot)
		{
			return ;
		}

		var pos = path.lastIndexOf('/');
		var tmpfile = path.substr(0, pos);
		var file = path.substr(0, tmpfile.lastIndexOf('/')+1);
		console.log(file);
		GetFileList('#folerviewlist', file, 0);
	});

	//绑定单击文件上传按钮事件
	$('#folderList_header_toolbar_upload').click(function(event)
	{
		console.log('click the upload bottom');
		$('#fileupload').click();
		$('#folderList_opeate').show();
		
	});

	//上传文件已经选择
	$('#fileupload').change(function()
	{
		var afile = document.getElementById('fileupload');
		for (i = 0; i < afile.files.length; i++) 
		{
			console.log(afile.files[i].name);
			var filename = afile.files[i].name;
			var filesize = (afile.files[i].size/1024).toFixed(2);
			$('#folderList_opeate_upload_filelist_ul_name').append('<li><a href="#" title="'+filename+'">'+filename+'</a></li>');
			$('#folderList_opeate_upload_filelist_ul_size').append('<li>'+filesize+' KB</li>');
			var $button = $('#folderList_opeate_upload_filelist_ul_choose').append('<li><button type="submit" id="bn_upload_start" value="删除">删除</button></li>');
			
			$button.on("click","button", function(event)
			{
				console.log('clicked');
				return false;
			});
		}

	});
	//绑定单击新建文件按钮事件
	$('#folderList_header_toolbar_newfile').click(function(event)
	{
		var d = dialog(
		{
    		title: '文件名',
    		content: '<input id="filename" autofocus />',
    		okValue: '确定',
    		cancelValue: '取消',
    		ok: function ()
    		{
        		var path = $('#folderList_header_path').text();
        		var file = $('#filename').val();
        		console.log('path:'+path);
        		console.log('file'+file);
        		CreateFile(path, file);
        		return true;
    		}
		});
		d.show(document.getElementById('folderList_header_toolbar_newfile'));
	});

	//绑定单击新建文件夹按钮事件
	$('#folderList_header_toolbar_newfolder').click(function(event)
	{
			var d = dialog(
			{
    			title: '文件夹名',
    			content: '<input id="foldername" autofocus />',
    			okValue: '确定',
    			cancelValue: '取消',
    			ok: function ()
    			{
        			var path = $('#folderList_header_path').text();
        			var folder = $('#foldername').val();
        			CreateFolder(path, folder);
        			return true;
    			}
			});
			d.show(document.getElementById('folderList_header_toolbar_newfolder'));
	});

	/*//文件上传控件处理函数
	$('#fileupload').fileupload(
	{
    	drop: function (e, data)
    	{
        	$.each(data.files, function (index, file)
        	{
            	alert('Dropped file: ' + file.name);
        	});
    	},
    	change: function (e, data)
    	{
        	$.each(data.files, function (index, file)
        	{
            	alert('Selected file: ' + file.name);
        	});
        	$("#folderList_opeate").show();
    	}
	});*/

	//上传开始
	$('#bn_upload_start').click(function(event)
	{
		console.log('start');
		/*$.ajax(
		{
			url: 'web_manage.php',
			type: 'POST',
			dataType: 'JSON',
			data: {'action':'UploadFile','path':path, 'files':#fileupload}
		})
		.done(function() {
			console.log("success");
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});*/
	});

	Login();
});

