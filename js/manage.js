var  gfile;
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
			$("#header_userinfo_head").show();
			$("#header_userinfo_name").html(json.msg);
			$("#header_userinfo_state").text('当前在线').css({color:"#13E03C"});
		}
		else
		{
			location.href = json.msg;
		}
	})
	.error(function(info) 
	{
		location.href = "index.php";
	});
}

function GetFileIndex()
{
	$.ajax({
		url: 'web_manage.php',
		type: 'POST',
		dataType: 'JSON',
		data: {'action':'GetFileIndex'}
	})
	.done(function(json)
	{
		$('#folderTree').tree({
    		data: json,
    		autoOpen: false,
    		dragAndDrop: true
		});

		$('#folderList_header_path').text('/');
		$('#folerviewlist').empty();
		$.each(json, function(idx, obj) 
		{
				$('#folerviewlist').append('<li><a href="#">'+obj+'</a></li>');
				/*if (object == '#folderTree')
				{
					$('#folderTree').tree('appendNode', obj, node);
				}*/
		});
	})
	.error(function(json) {
		console.log('getFileIndexError:'+json);
		/* Act on the event */
	});
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
		console.log('get file: '+file);
		if ($.isEmptyObject(json))
		{
			
			if (object == '#folderTree')
			{
				var pos = file.lastIndexOf('/')+1;
				$('#folerviewlist').empty();
				$('#folderList_header_path').text(file.substr(0, pos-1));
				var showFile = file.substr(pos, file.length);
				$('#folerviewlist').append('<li><a href="#">'+showFile+'</a></li>');
			}
			
			return ;
		}

		if (file == '/')
		{
			$('#folderTree').tree({
    			data: json,
    			autoOpen: false,
    			dragAndDrop: true
			});

		}
		$('#folderList_header_path').text(file);
		$('#folerviewlist').empty();
		$.each(json, function(idx, obj) 
		{
				$('#folerviewlist').append('<li><a href="#">'+obj+'</a></li>');
				if (object == '#folderTree')
				{
					$('#folderTree').tree('appendNode', obj, node);
				}
		});

		return json;
		
	})
	.fail(function(json) {
		console.log("get file list error"+json);
	})
}

function ShowDig(object ,msg)
{
	var path = $('#folderList_header_path').text();
	GetFileList('#folderTree', path, 0);
	var d = dialog({
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
			return true;
		}
	})
	.fail(function(json) {
		console.log("create folder error"+json);
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
			return true;
		}
	})
	.fail(function(json) 
	{
		console.log("create file error"+json);
		return false;
	})

}

function FileOperate(action, args)
{
	var path = $('#folderList_header_path').text();
	var file = gfile;
	switch (action)
	{
		case 'open':
			return;
			break;

		case 'download':
			return;
			break;

		case 'delete':
			console.log(path+file);
			break;

		case 'rename':
			console.log(path+file);
			return ;
			break;
	}
	$.ajax({
		url: 'web_manage.php',
		type: 'POST',
		dataType: 'JSON',
		data: {'action':action,'path':path, 'file':file, 'newfile':args}
	})
	.done(function(json) 
	{
		if (json.state == 0)
		{
			GetFileList('#folerviewlist', path, 0);
			ShowDig(null, json.msg);
		}
	})
	.fail(function(json) {
		console.log("error"+json);
	})
	.always(function() {
		console.log("complete");
	});
	
	console.log(action);
}

function ShowContextMenu(object)
{
	var imageMenuData = [
    		 [{
        		text: "打开",
        		func: function() 
        		{
            		FileOperate('open', 0);
        		}
   			 },
    		 {
        		text: "下载",
        		func: function() 
        		{
            		FileOperate('download', 0);
        		}
        
   			 },
   			  {
        		text: "删除",
        		func: function() 
        		{
            		FileOperate('delete', 0);
        		}
    		}, 
    		{
        		text: "重命名",
        		func: function() 
        		{
        			FileOperate('rename', 0);
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
        	var tmp = node.parent;
        	path.push(node.name);
        	while(tmp.name != '' )
        	{
        		path.push(tmp.name);
        		tmp = tmp.parent;
        	}
        	path.reverse();
        	var dirname = path.join('/');
        	GetFileList('#folderTree', dirname, node);}
	);

	//绑定单击文件预览列表li事件
	$("#folerviewlist").on("click","li", function()
	{
		var Folderpath = $('#folderList_header_path').text();
		if (Folderpath == '/')
		{
			Folderpath = '';
		}
		var path = Folderpath+'/'+$(this).text();
		GetFileList('#folerviewlist', path, 0);
	});

	$("body").on("contextmenu", 0, function(event)
	{
		event.preventDefault();
	});

	$("#folerviewlist").on("mouseenter","li", function(event)
	{
		gfile = $(this).text();
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
		var path = $('#folderList_header_path').text();
		if (path == '/')
		{
			return ;
		}
		GetFileList('#folderTree','/', 0);
	});
	//绑定单击返回上一级按钮事件
	$('#folderList_header_back').click(function()
	{
		var path = $('#folderList_header_path').text();
		if (path == '/')
		{
			return ;
		}

		var pos = path.lastIndexOf('/');
		var file = path.substr(0, pos);
		GetFileList('#folerviewlist', file, 0);
	});

	//绑定单击文件上传按钮事件
	$('#folderList_header_toolbar_upload').click(function(event)
	{
		console.log('click the upload bottom');
		$('#fileupload').click();
		console.log($('#fileupload').val());
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
		console.log($('#fileupload').val());
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
	GetFileIndex();
	GetFileList('#folderTree','/', 0);
	
});

