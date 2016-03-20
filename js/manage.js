function login()
{
	$.ajax({
		url: 'web_manage.php',
		type: 'POST',
		dataType: 'JSON',
		data: {'action':'Login'}
	})
	.done(function(json) 
	{
		console.log(json);
		if (json.state == 0)
		{
			$("#header_userinfo_head").show();
			$("#header_userinfo_name").html(json.msg);
			$("#header_userinfo_state").text('在线').css({color:"#13E03C"});
		}
		else
		{
			location.href = json.msg;
		}
	})
	.error(function(info) {
		console.log('login fpt error which in manage.js'+info);
	});
}

function get_pwd()
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
	})
}

$(document).ready(function()
{
	login();
	get_pwd();
});