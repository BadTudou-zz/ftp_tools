/*
		Copyright © BadTudou, 2016
		All rights reserved

		Name	:	manage.js
		By		:	BadTudu
		Date	:	2016年3月18日13:54:05
		Note	:	FTP文件管理的JQuery脚本
*/

//根目录的路径
var gRootPath;
//当前文件
var gCurrentFile;
//操作的路径
var gSourcePath;
//操作的文件
var gSourceFile;
//XHR对象
gXhr = new XMLHttpRequest();
//剪切的标志
var gbIsCut = false;
//表单的文件数据
var gFd = new FormData();


/**
 * [ext是否支持显示图标的文件类型]
 * @param {[string]} ext [扩展名]
 * @return [bool]         [true:是; false:否]
 */
function IsFileType(ext)
{
	var data = new Array('txt','php', 'html', 'exe', 'zip', 'png', 'jpeg');
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
	$tree.tree({data:data, autoOpen: true,  dragAndDrop: true});
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
	var pos;
	var linkPath = "";
	while ( (pos=path.indexOf('/')) != -1)
	{
		var textPath = path.substr(0,pos);
		var clickPath = '<a href="#">'+textPath+'</a>/';
		linkPath += clickPath;
		path = path.substr(pos+1);
	}
	
	$('#folderList_header_path').html(linkPath);
}

function SetCurrentFile(file)
{
	gCurrentFile = file;
}

function GetCurrentFile()
{
	return gCurrentFile;
}

function GetSourcePath()
{
	return gSourcePath;
}

function GetSourceFile()
{
	return gSourceFile;
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

/**
 * [获取根路径]
 * @param {[string]} rootPath [根路径]
 */
function GetTreeRoot()
{
	var treeRoot = $('#folderTree').tree('getNodeById', 1);
	return treeRoot;
}

/**
 * [上传文件列表添加列表项]
 * @param {[string]} filename [文件名]
 * @param {[string]} filesize [文件大小kb]
 */
function AddFileItem(filename, filesize)
{
	$('#folderList_opeate_upload_filelist_ul_name').append('<li><a href="#" title="'+filename+'">'+filename+'</a></li>');
	$('#folderList_opeate_upload_filelist_ul_size').append('<li>'+filesize+' KB</li>');
	$('#folderList_opeate_upload_filelist_ul_bn').append('<li><button type="submit">删除</button></li>');
	$('#folderList_opeate_upload_filelist_ul_ck').append('<li><input type="checkbox"/></li>');
}

/**
 * [上传文件列表移除列表项]
 * @param {[int]} index [列表项的下标]
 */
function RemoveFileItem(index)
{
	$("#folderList_opeate_upload_filelist_ul_name li:eq("+index+")").remove();
	$("#folderList_opeate_upload_filelist_ul_size li:eq("+index+")").remove();
	$("#folderList_opeate_upload_filelist_ul_bn li:eq("+index+")").remove();
	$("#folderList_opeate_upload_filelist_ul_ck li:eq("+index+")").remove();
	/*var afile = document.getElementById('fileupload');
	console.log('delete'+afile.files[index].name);*/
}

/**
 * [移除上传文件列表所有列表项]
 */
function RemoveAllFileItem()
{
	$('#folderList_opeate_upload_filelist_ul_name').empty();
	$('#folderList_opeate_upload_filelist_ul_size').empty();
	$('#folderList_opeate_upload_filelist_ul_bn').empty();
	$('#folderList_opeate_upload_filelist_ul_ck').empty();
}

/**
 * [阻止浏览器的默认拖拽]
 */
function PreventBrowserDrop()
{
   $(document).on(
   { 
        dragleave:function(e)
        {    //拖离 
            e.preventDefault(); 
        }, 
        drop:function(e)
        {  //拖后放 
            e.preventDefault(); 
        }, 
        dragenter:function(e)
        {    //拖进 
            e.preventDefault(); 
        }, 
        dragover:function(e)
        {    //拖来拖去 
            e.preventDefault(); 
        } 
    }); 
}

function CopyFile(sPath, sFile)
{
	gSourcePath = sPath;
	gSourceFile = sFile;
}

function PasteFile()
{
	if (gbIsCut)
	{
		FileOperate('paste', GetSourcePath(), GetSourceFile(), true);
		gbIsCut = false;
	}
	else
	{
		FileOperate('paste', GetSourcePath(), GetSourceFile(), null);
	}
	
}

function CatchHotKey()
{
	$(document).keydown(function(event) 
	{
		/* Act on the event */
		if (event.ctrlKey)
		{
			switch (event.keyCode)
			{
				case 67:
					if (GetCurrentFile() != null)
					{
						CopyFile(GetCurrentPath(), GetCurrentFile());
						ShowDig('folderList_header', '已复制');
					}
					break;

				case 86:
					PasteFile(GetCurrentPath());
					break;

			}
		}
	}); 
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
			$("#header_userinfo_name").text($.cookie('ftp_cookie[2]')).css({color:"#13E03C"});
			//$("#header_userinfo_state").text('当前在线').css({color:"#13E03C"});
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
			$('#folerviewlist').append('<li><a href="#"><img src="images/'+ext+'.png"/>'+obj+'</a></li>');
		}
		else
		{
			$('#folerviewlist').append('<li><a href="#"><img src="images/folder128.png"/>'+obj+'</a></li>');
		}
	})
}

/**
 * [设置文件树的结点]
 * @param {[json]} json [文件列表]
 * @param {[node]} node [结点]
 */
function SetFileTree(json, node)
{
	RemoveAllChilds(node);
	$.each(json, function(idx, obj)
	{
		$('#folderTree').tree('appendNode', obj, node);
	})
}

/**
 * [获取文件列表]
 * @param {[控件]} object [文件树结点/列表]
 * @param {[string]} file   [路径]
 * @param {[node]} node   [文件树结点]
 */
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
		ShowDig('folderTree', '获取文件列表失败');
	})
}


/**
 * [显示对话框]
 * @param {[对象]} object [关联的对象]
 * @param {[string]} msg  [消息内容]
 */
function ShowDig(object ,msg)
{
	var path = $('#folderList_header_path').text();
	GetFileList('#folerviewlist', path, 0);
	var d = dialog(
	{
		align: 'bottom',
		content: msg
	});
	d.show(document.getElementById(object));
	setTimeout(function () 
	{
     d.close().remove();
	}, 2000);
}

/**
 * [创建文件夹]
 * @param {[string]} path   [路径]
 * @param {[string]} folder [文件夹名]
 */
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
	})
	.fail(function(json) 
	{
		ShowDig('folderList_header_toolbar_newfolder','创建文件夹时服务端发生失败');
	})

}

/**
 * [创建文件]
 * @param {[string]} path   [路径]
 * @param {[string]} file [文件夹]
 */
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
	})
	.fail(function(json)
	{
		ShowDig('folderList_header_toolbar_newfile','创建文件时服务端发生失败');
	})

}

function UploadFile()
{
	$.ajax(
	{
		url: 'web_manage.php',
		type: 'POST',
		dataType: 'JSON',
		data: {'action':'UploadFile','path':GetCurrentPath()}
	})
	.done(function(json)
	{
		if (json.state == 0)
		{
			GetFileList('#folerviewlist', GetCurrentPath(), 0);
			return true;
		}
	})

}
/**
 * [开始上传文件]
 */
function StartUploadFile()
{
	$('#bn_upload_cancel').click();
	ShowDig('folderList_header_toolbar_upload','上传文件成功');
	UploadFile();
}
/**
 * [文件操作]
 * @param {[string]} action [操作行为]
 * @param {[string]} file   [文件路径]
 * @param {[string]} args   [参数]
 */
function FileOperate(action, path, file, args)
{
	$.ajax(
	{
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
			}
			else if (action == 'paste')
			{
				UploadFile();
				ShowDig('folderList_header', '粘贴成功');
			}
			else
			{
				ShowDig('folderList_header', json.msg);
				GetFileList('#folerviewlist', path, 0);
			}
		}
	})
	.fail(function(json) 
	{
		ShowDig('folderList_header', '文件操作失败');
	})
}

/**
 * [显示上下文菜单]
 * @param {[object]} object [目标]
 */
function ShowContextMenu(object)
{
	var imageMenuData = [
    		 [{
        		text: "打开",
        		func: function()
        		{
            		FileOperate('open', GetCurrentPath(), $(this).text(), 0);
        		}
   			  },
    		  {
        		text: "下载",
        		func: function()
        		{
            		FileOperate('download', GetCurrentPath(), $(this).text(), 0);
        		}
   			  },
   			  {
        		text: "复制",
        		func: function()
        		{
            		CopyFile(GetCurrentPath(), $(this).text());
            		ShowDig('folderList_header', '已复制');
        		}
    		  },
    		  {
        		text: "剪切",
        		func: function()
        		{
            		CopyFile(GetCurrentPath(), $(this).text());
            		gbIsCut = true;
            		ShowDig('folderList_header', '已剪贴');
        		}
    		  },
    		  {
        		text: "粘贴",
        		func: function()
        		{
            		PasteFile();
        		}
    		  },
   			  {
        		text: "删除",
        		func: function()
        		{
            		FileOperate('delete', GetCurrentPath(), $(this).text(), 0);
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
			        		FileOperate('rename', GetCurrentPath(), file, newname);
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

	//绑定单击退出按钮事件
	$('#header_userinfo_exit').click(function(event) 
	{
		this.href = "index.php";
	});

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
		SetCurrentFile($(this).text());
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

	//绑定目录切换
	$("#folderList_header_path").on("click","a", function()
	{
		var text = $(this).text();
		var path = $("#folderList_header_path").text();
		var pos = path.indexOf(text);
		var currentPath = path.substr(0, pos+text.length+1);
		GetFileList('#folerviewlist', currentPath, 0);
	});

	//绑定单击返回上一级按钮事件
	$('#folderList_header_back').click(function()
	{
		var path = $('#folderList_header_path').text();
		if (path == GetRootPath())
		{
			return ;
		}

		var pos = path.lastIndexOf('/');
		var tmpfile = path.substr(0, pos);
		var file = path.substr(0, tmpfile.lastIndexOf('/')+1);
		GetFileList('#folerviewlist', file, 0);
	});

	//绑定单击文件上传按钮事件
	$('#folderList_header_toolbar_upload').click(function(event)
	{
		if( $("#folderList_opeate").is(":hidden") )
		{
			$('#folderList_opeate').show();
		} 
		else
		{
			$('#bn_upload_cancel').click();
		}
	});


	//上传文件已经选择
	$('#fileupload').change(function()
	{
		$('#folderList_opeate').show();
		var afile = document.getElementById('fileupload');
		var filelen = $("#folderList_opeate_upload_filelist_ul_name li").length;
		for (i = 0; i < afile.files.length; i++) 
		{
			var filename = afile.files[i].name;
			var filesize = (afile.files[i].size/1024).toFixed(2);
			gFd.append('files['+(i+filelen)+']', afile.files[i]);
			AddFileItem(filename, filesize);
        }
	});

	//绑定单击文件添加按钮事件
	$('#bn_upload_add').click(function(event)
	{
		$('#fileupload').click();
	});

	//绑定单击列表项的取消按钮
	$('#bn_upload_cancel').click(function()
	{
		RemoveAllFileItem();
		gFd = new FormData();
		$('#folderList_opeate').hide();
	});

	//绑定单击列表项的删除按钮
	$('#folderList_opeate_upload_filelist_ul_bn').on("click","li", function(event)
	{
		var tar = event.target;
		var index = $(this).index();
		if (tar.nodeName == "BUTTON")
		{
			RemoveFileItem(index);
		}
		
	});

	//绑定单击删除按钮
	$('#bn_upload_delete').click(function(event)
	{
		var deleteFiles = $("ol#folderList_opeate_upload_filelist_ul_ck li input[type=checkbox]");
		deleteFiles.each(function(index)
		{
			if ($(this).is(':checked'))
			{
				RemoveFileItem(index);
			}
		});
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

	//单击开始上传按钮
	$("#bn_upload_start").click(function()
	{
		if ($("#folderList_opeate_upload_filelist_ul_name li").length == 0)
		{
			return ;
		}
		gXhr.open("post", "upload.php", true);
		gXhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		gXhr.send(gFd);
		gXhr.onreadystatechange = function(state)
		{
			if (gXhr.readyState == 4 && gXhr.responseText == 'true')
			{	
				StartUploadFile();		
			}
		}
		
	});
	//提交文件列表表单表单
	$("#form_uploadfile").submit(function()
	{
		return false;
	});

	//文件拖拽
	var drop_area = document.getElementById('drop_area');
	drop_area.addEventListener("drop", function(event)
	{
		event.preventDefault();
		var files = event.dataTransfer.files;
		var filelen = $("#folderList_opeate_upload_filelist_ul_name li").length;
		for (var i = 0; i < files.length; i++) 
		{
    		var file = files[i];
    		gFd.append('files['+(i+filelen)+']', file);
    		var filename = files[i].name;
			var filesize = (files[i].size/1024).toFixed(2);
			AddFileItem(filename, filesize);
		}
	}, false);

	PreventBrowserDrop();
	CatchHotKey();
	Login();
});