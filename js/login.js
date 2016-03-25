/*
	Copyright © BadTudou, 2016
	All rights reserved

	Name	:	login.js
	By		:	BadTudu
	Date	:	2016年3月18日13:54:05
	Note	:	登录FTP服务器
*/
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

	//检测所有输入项是否有值，以决定是否启用提交按钮
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

	//提交表单，登录FTP，成功则跳转至服务器返回的页面，失败则显示出错信息
	$("#submit_button").click(function(event) 
	{
		$("#hintText").text("正在登陆FPT服务器......");
		$.ajax(
		{
			url: 'web_login.php',
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
			}
		})
		.error(function(json) 
		{
			console.log('somethins was wrong when login'+json);
		});
		return false;
	});
});