
	<?php

		function sendAnswer($aAnswer)
		{
			echo json_encode($aAnswer);
		}
		//
		phpinfo();
		define('DEBUG', true);
		if (!defined('DEBUG'))
		{
			error_reporting(0);
		}
		if (!isset($_POST['ftp_host']))
		{
			echo '没有数据';
			exit();
		}
		//echo '开始处理';
		//exit();

		$ftp_host = $_POST['ftp_host'];
		$ftp_port = intval($_POST['ftp_port']);
		$ftp_user = $_POST['ftp_user'];
		$ftp_pwd  = $_POST['ftp_pwd'];
		

		try
		{
			$conn = ftp_connect($ftp_host, $ftp_port, 300);
			if ($conn == FALSE)
			{
				$aLoginResult['state'] = 1;
				$aLoginResult['msg'] = '无法连接FTP服务器';
				sendAnswer($aLoginResult);
				exit();
			}
			else
			{
				if (ftp_login($conn ,$ftp_user, $ftp_pwd))
				{
					$aLoginResult['state'] = 0;
					$aLoginResult['msg'] = '登陆成功';
					sendAnswer($aLoginResult);
					exit();

					$directory_root = ftp_pwd($conn);
    				$directory = ftp_nlist($conn, '');

    				foreach ($directory as $key => $value) 
    				{
	    				echo "ftp://{$ftp_host}{$directory_root}/{$value}<br/>";
    				}
				}
				else 
				{
    				$aLoginResult['state'] = 2;
    				$aLoginResult['msg'] = '无法登陆该FTP用户';
    				sendAnswer($aLoginResult);
    				exit();
				}
	
				ftp_close($conn);
			}

		}
		catch(Exception $e)
		{
			throw new Exception();
			$aLoginResult['state'] = 12;
			$aLoginResult['msg'] = '抛出异常';
			echo json_encode($aLoginResult);
			exit();
		}
		//echo 'ddd';
		//echo json_encode($aLoginResult);
		//		


	?>
