<?php
	namespace badtudou;
	class FTP
	{
		protected $m_host;
		protected $m_port;
		protected $m_user;
		protected $m_pwd;
		protected $m_resource;
		protected $m_root;
		protected $m_ConnectState;

		public function __construct($host, int $port, $user, $pwd)
		{
			$m_host = $host;
			$m_port = $port;
			$m_user = $user;
			$m_pwd  = $pwd;
			$m_ConnectState = false;
			$m_LoginState = false;
		}

		public function __destruct()
		{
			if (m_ConnectState == true)
			{
				ftp_close($m_resource);
			}
		}

		protected function login()
		{
			$m_resource = ftp_connect($m_host, $m_port);
			if ($m_resource)
			{
				$m_ConnectState = true;

				try
				{
					@ftp_login($m_resource, $m_user, $m_pwd);
					$m_LoginState = true;
				}
				catch(Exception $e)
				{
					throw new Exception("Error Processing Request", 1);
					exit();
				}
			}
		}
	}
?>