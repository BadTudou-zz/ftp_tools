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

function GetFileList(object, file, state, node)
{
	$.ajax({
		url: 'web_manage.php',
		type: 'POST',
		dataType: 'JSON',
		data: {'action':'GetFileList','file':file, 'state':state}
	})
	.done(function(json)
	{
		console.log(file+json);
		if (object == '#folderTree')
		{
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
					//$('#folerviewlist').append('<li><span>'+obj+'</span></li>');
					$('#folerviewlist').append('<li><a href="#">'+obj+'</a></li>');
					if (obj == file)
					{
						return ;
					}
					$('#folderTree').tree('appendNode', obj, node);
				});
		}
		return json;
		
	})
	.fail(function(json) {
		console.log("get file list error"+json);
	})
}

function ChangeDir(path)
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
        	console.log('click'+path.join('/'));
        	var data = GetFileList('#folderTree','/'+path.join('/'), 0, node);}
	);

	//绑定单击文件预览列表li事件
	$('folerviewlist').each(function(index, el) {
		
		$(this).click(function(){
			console.log(index);
		
		});
		//console.log($this.val());
		
	});
	GetFileList('#folderTree','/',0, 0);
	Login();
});

