$(document).ready(function() 
{
	$("input").focus(function(event) 
	{
		$("#hintText").text("登陆FTP服务器");
	});

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
		console.log("提交表单");
		$.ajax(
		{
			url: 'web_manage.php',
			type: 'POST',
			dataType: 'JSON',
			data:$('#ftp_info').serialize(),
		})
		.done(function(data) 
		{
			/*if (json.state == 0)
			{
				console.log('此处跳转到目标网页');
			}
			else
			{
				$("#hintText").text(json.msg).addClass('hintError');
			}*/
			console.log("ok");
			//console.log(data.msg);
		})
		.fail(function() 
		{
			console.log("connect error");
		})
		.always(function() 
		{
			console.log("complete");
		});

		//return false;
	});
});