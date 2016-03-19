<?php
	namespace badtudou;
	class FTP
	{
		protected $m_host;
		protected $m_port;
		protected $m_user;
		protected $m_pwd;
		protected $m_resource;
		protected $m_connect;
		protected $m_root;
		protected $m_ConnectState;
		protected $m_LoginState;

		public function __construct($host, int $port, $user, $pwd)
		{
			$this->m_host = $host;
			$this->m_port = $port;
			$this->m_user = $user;
			$this->m_pwd  = $pwd;
			$this->m_ConnectState = false;
			$this->m_LoginState = false;
		}

		public function __destruct()
		{
			
			if ($this->getLoginState())
			{
				ftp_close($this->m_resource);
			}

			//echo json_encode('dfsdfdfsdsdf');
		}

		public function connect()
		{
			$this->m_resource = @ftp_connect($this->m_host, $this->m_port);
			if ($this->m_resource)
			{
				$this->m_ConnectState = true;
			}
		}

		public function login()
		{
			try
			{
				if ( @ftp_login($this->m_resource, $this->m_user, $this->m_pwd) )
				{
					$this->m_LoginState = true;
				}
			}
			catch(Exception $e)
			{
				throw new Exception("Error Processing Request", 1);
				exit();
			}
		}

		public function close()
		{
			ftp_close($this->m_resource);
			$this->m_LoginState = false;
		}

		public function getConnectState()
		{
			return $this->m_ConnectState;
		}

		public function getLoginState()
		{
			return $this->m_LoginState;
		}

		public  function getPWD()
		{
			return ftp_pwd($this->m_resource);
		}

		public function getUser()
		{
			return $this->m_user;
		}

	}
?>