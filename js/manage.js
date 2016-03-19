$(document).ready(function() 
{
	$("input").focus(function(event) 
	{
		$("#hintText").text("登陆FTP服务器").addClass('hintOk');
		$("#hintText").removeClass('hintError');
	});

	//读取Cookie的值
	$('#ftp_host').val($.cookie('ftp_cookie[0]'));
	$('#ftp_port').val($.cookie('ftp_cookie[1]'));
	$('#ftp_user').val($.cookie('ftp_cookie[2]'));
	$('#ftp_pwd').val($.cookie('ftp_cookie[3]'));

	//检测所有输入项是否有值
	$("input").hover(function(event) 
	{
		var bInputState = true;
		$("input").each(function(index, el) 
		{
			if (el.value == "")
			{
				bInputState = false;
			}
		});
		if (bInputState)
		{
			$("#submit_button").removeAttr('disabled');
			$("#submit_button").removeClass("submit_buttonError");
			$("#submit_button").addClass("submit_buttonOk");
		}
		else
		{
			$("#submit_button").addClass('submit_buttonError');
			$("#submit_button").attr('disabled',"true");
		}
	});

	//提交表单，异步处理
	$("#submit_button").click(function(event) 
	{
		$("#hintText").text("正在登陆FPT服务器......");
		$.ajax(
		{
			url: 'web_manage.php',
			type: 'POST',
			dataType: 'JSON',
			data:$('#ftp_info').serialize(),
		})
		.done(function(json)
		{
			if (json.state == 0)
			{
				$("#hintText").text("登陆成功");
				location.href = json.msg;
			}
			else
			{
				$("#hintText").text(json.msg).addClass('hintError');
				console.log(json.msg);
			}
		})
		return false;
	});
});