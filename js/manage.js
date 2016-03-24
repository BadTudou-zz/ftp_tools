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
		console.log('login fpt error which in manage.js'+info);
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
				//$('#folderList_header_path').text()
				$('#folderList_header_path').text(file.substr(0, pos-1));
				var showFile = file.substr(pos, file.length);
				$('#folerviewlist').append('<li><a href="#">'+showFile+'</a></li>');
				console.log(showFile+':'+file);
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
			var path = $('#folderList_header_path').text();
			GetFileList('#folderTree', path, 0);
			var d = dialog({
					    content: '新建文件夹成功'
						});
			d.show(document.getElementById('folderList_header_toolbar_newfolder'));
			setTimeout(function () 
			{
    			d.close().remove();
			}, 2000);

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
	$.ajax({
		url: 'web_manage.php',
		type: 'POST',
		dataType: 'JSON',
		data: {'action':'CreateFile','path':path, 'file':file}
	})
	.done(function(json) 
	{
		if (json.state == 0)
		{
			var path = $('#folderList_header_path').text();
			GetFileList('#folderTree', path, 0);
			var d = dialog({
					    content: '新建文件成功'
						});
			d.show(document.getElementById('folderList_header_toolbar_newfile'));
			setTimeout(function () 
			{
    			d.close().remove();
			}, 2000);

			return true;
		}
	})
	.fail(function(json) {
		console.log("create file error"+json);
		return false;
	})

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
        	console.log('ddd '+dirname);
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

	//绑定单击主页按钮事件
	$('#folderList_header_logo').click(function(){
		var path = $('#folderList_header_path').text();
		if (path == '/')
		{
			return ;
		}
		GetFileList('#folderTree','/', 0);
	});
	//绑定单击返回上一级按钮事件
	$('#folderList_header_back').click(function(){
		var path = $('#folderList_header_path').text();
		if (path == '/')
		{
			return ;
		}

		var pos = path.lastIndexOf('/');
		var file = path.substr(0, pos);
		console.log('back tuo'+file);
		GetFileList('#folerviewlist', file, 0);
	});

	//绑定单击文件上传按钮事件
	$('#folderList_header_toolbar_upload').click(function(event)
	{
		console.log('click the upload bottom');
		$('#fileupload').click();
	});

	//绑定单击新建文件按钮事件
	$('#folderList_header_toolbar_newfile').click(function(event) 
	{
		var d = dialog({
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
    		},
    		
    		cancel: function () 
    		{

    		}
		});
		d.show(document.getElementById('folderList_header_toolbar_newfile'));
	});

	//绑定单击新建文件夹按钮事件
	$('#folderList_header_toolbar_newfolder').click(function(event) 
	{
			var d = dialog({
    		title: '文件夹名',
    		content: '<input id="foldername" autofocus />',
    		okValue: '确定',
    		cancelValue: '取消',
    		ok: function () 
    		{
        		var path = $('#folderList_header_path').text();
        		var folder = $('#foldername').val();
        		console.log('path:'+path);
        		console.log('folder:'+folder);
        		CreateFolder(path, folder);
        		return true;
    		},
    		
    		cancel: function () 
    		{

    		}
		});
		d.show(document.getElementById('folderList_header_toolbar_newfolder'));
	});

	//文件上传控件处理函数
	$('#fileupload').fileupload({
    drop: function (e, data) {
        $.each(data.files, function (index, file) {
            alert('Dropped file: ' + file.name);
        });
    },
    change: function (e, data) {
        $.each(data.files, function (index, file) {
            alert('Selected file: ' + file.name);
        });
        $("#folderList_opeate").show();
    }
});
	GetFileList('#folderTree','/', 0);
	Login();
});

