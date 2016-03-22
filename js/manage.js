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

function GetPwd()
{
	$.ajax({
		url: 'web_manage.php',
		type: 'POST',
		dataType: 'JSON',
		data: {'action':'GetPWD'}
	})
	.done(function(json)
	{
		$("#folderTree").html(json.msg);
		console.log(json);

		return json.msg;
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
			if (object == '#folderTree')
			{
				$('#folerviewlist').empty();
				var pos = file.lastIndexOf('/')+1;
				var showFile = file.substr(pos, file.length-pos);
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

/*function ChangeDir(path)
{
	$.ajax({
		url: 'web_manage.php',
		type: 'POST',
		dataType: 'JSON',
		data: {'action':'ChangeDir','path':path}
	})
	.done(function() {
		console.log("success");
	})
	.fail(function() {
		console.log("change dir error");
	})
	
}
*/
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
        	while ( (tmp.name != '') && (tmp.name != node.name) )
        	{
        		path.push(tmp.name);
        		tmp = tmp.parent;
        	}
        	path.push(node.name);
        	var dirname = path.join('/');
        	$('#folderList_header_path').text('/'+dirname);
        	GetFileList('#folderTree','/'+dirname, node);}
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
	$('#folderList_header_path').text('/');
	GetFileList('#folderTree','/', 0);
	Login();
});

