<?php 
	date_default_timezone_set('UTC');
	/**
	 * @author kevinj045/me
	 * @version 1.0.0 because this is the first time i make this class ever.
	 */
	require_once(_mydir."_php/login/formvalidator.php");
	class Chats
	{
		
		function __construct($db_host,$db_username,$db_pwd,$db_name,$db_table,$site_name)
		{
			$this->DB = array("host"=>$db_host,
												"username"=>$db_username,
												"pwd"=>$db_pwd,
												"name"=>$db_name,
												"table"=>$db_table);
			$this->site_name = $site_name;
			$this->lgnm = $GLOBALS['lgnM'];
			$this->error_message = "";
			$this->formvars = array();
			$this->InitDB();
		}

		function HandleError($err)
    {
        $this->error_message .= $err."\r\n";
    }

    function GetErrorMessage()
    {
        if(empty($this->error_message))
        {
            return '';
        }
        $errormsg = nl2br(htmlentities($this->error_message));
        return $errormsg;
    }  

		function InitDB(){
			$db_table = $this->DB['table'];
    	$db_host = $this->DB['host'];
    	$db_name = $this->DB['name'];
    	$db_username = $this->DB['username'];
    	$db_pwd = $this->DB['pwd'];
			$this->connection = mysqli_connect($this->DB['host'],
																				 $this->DB['username'],
																				 $this->DB['pwd']);
			$this->conn = new PDO("mysql:host=$db_host;dbname=$db_name", $db_username, $db_pwd);

      if(!$this->connection)
      {   
          $this->HandleError("Database Login failed! Please make sure that the DB login credentials provided are correct");
          return false;
      }
      if(!mysqli_select_db($this->connection,$this->DB['name']))
      {
          $this->HandleError('Failed to select database: '.$this->DB['name'].' Please make sure that the database name provided is correct');
          return false;
      }
      if(!mysqli_query($this->connection,"SET NAMES 'UTF8'"))
      {
          $this->HandleError('Error setting utf8 encoding');
          return false;
      }
      if(!$this->CreateTable())
      {
      	$this->HandleError('Error Creating tables');
        return false;
      }
      return true;
		}

		function CreateTable(){
			$db_table = $this->DB['table'];
			// This SQL is usefull For Checking if the table exists, if not
			// It will create it,
			$qry = "Create Table IF NOT EXISTS $db_table (".
              "id_msg INT NOT NULL AUTO_INCREMENT,
					      name varchar(255),
					      username varchar(255),
					      pp varchar(255),
					      email varchar(255),
					      message LONGTEXT,
					      ctime varchar(255),
					      PRIMARY KEY ( id_msg )".
              ")";
                
        if(!mysqli_query($this->connection,$qry))
        {
            $this->HandleError("Error creating the table \nquery was\n $qry");
            return false;
        }
        return true;
		}

		function InsertToDB(&$formvars){
			$db_table = $this->DB['table'];
			$qry = 'insert into '.$db_table.'(
                name,
                username,
                pp,
                email,
                message,
                ctime
                )
                values
                (
                "' . $this->SanitizeForSQL($formvars['name']) . '",
                "' . $this->SanitizeForSQL($formvars['username']) . '",
                "' . $formvars['pp'] . '",
                "' . $this->SanitizeForSQL($formvars['email']) . '",
                "' . $formvars['message'] . '",
                "' . $formvars['time'] . '"
                )';
      if(!mysqli_query( $this->connection, $qry))
      {
          $this->HandleError("Error inserting data to the table\nquery:$qry");
          return false;
      }  
      return true;
		}

		function sendMessage(){
			if(!$this->ValidateSubmission())
			{
				return false;
			}

			$formVars = $this->CollectSubmissions();

			if(!$this->lgnm->CheckLogin())
			{
				$this->HandleError('Sorry, You are not logged in');
				return false;
			}

			if(!$formVars)
			{
				$this->HandleError('Error With your submission, retry');
				return false;
			}

			if(!$this->InsertInfo())
			{	
				return false;
			}

			if(!$this->InsertToDB($this->formvars))
			{
				$this->HandleError('Error Putting your message to the database, retry');
				return false;
			}

			return true;
		}

		function InsertInfo(){
			if(!isset($_SESSION))
			{
				session_start();
			}
			return true;
		}

		function ValidateSubmission()
    {
        
        $validator = new FormValidator();
        $validator->addValidation("message","req","Please Put your message");

        
        if(!$validator->ValidateForm())
        {
            $error='';
            $error_hash = $validator->GetErrors();
            foreach($error_hash as $inpname => $inp_err)
            {
                $error .= $inpname.':'.$inp_err."\n";
            }
            $this->HandleError($error);
            return false;
        }        
        return true;
    }
    
    function CollectSubmissions()
    {
        $this->formvars['name'] = $this->Sanitize($_POST['name']);
        $this->formvars['username'] = $_POST['username'];
        $this->formvars['pp'] = $this->Sanitize($_POST['pp']);
        $this->formvars['message'] = $this->Sanitize($_POST['message']);
        $this->formvars['email'] = $this->Sanitize($_POST['email']);
        $this->formvars['time'] = date('r');
        return $this->formvars;
    }
    /*
	    Sanitize() function removes any potential threat from the
	    data submitted. Prevents email injections or any other hacker attempts.
	    if $remove_nl is true, newline chracters are removed from the input.
    */
    function Sanitize($str,$remove_nl=true)
    {
        $str = $this->StripSlashes($str);

        if($remove_nl)
        {
            $injections = array('/(\n+)/i',
                '/(\r+)/i',
                '/(\t+)/i',
                '/(%0A+)/i',
                '/(%0D+)/i',
                '/(%08+)/i',
                '/(%09+)/i'
                );
            $str = preg_replace($injections,'',$str);
        }

        return $str;
    }    
    function StripSlashes($str)
    {
        if(get_magic_quotes_gpc())
        {
            $str = stripslashes($str);
        }
        return $str;
    }

    function SanitizeForSQL($str)
    {
        if( function_exists( "mysqli_real_escape_string" ) )
        {
              $ret_str = mysqli_real_escape_string( $this->connection, $str );
        }
        else
        {
              $ret_str = addslashes( $str );
        }
        return $ret_str;
    }

    function getAllChats(){
    	$db_table = $this->DB['table'];
    	$qry = "SELECT * FROM ".$db_table;

    	$conn = $this->conn;
	
			$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		  $stmt = $conn->prepare($qry); 
		  $stmt->execute();
		  $result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
        
      if(!$result)
      {
          $this->HandleError("Error fetching data");
          return false;
      }

      $result = $stmt->fetchAll();

      if(count($result) <= 0)
      {
      	$this->HandleError("There are no records yet");
        return false;
      }
      
    	return $result;
    }

    function delete(){
    	$db_table = $this->DB['table'];
    	$qry = "DROP TABLE IF EXISTS ".$db_table;

    	if(!mysqli_query($this->connection,$qry))
      {
          $this->HandleError("Error deleting the table");
          return false;
      }
      return true;
    }

    function deleteMessage($time,$username,$message){
      $db_table = $this->DB['table'];
      $qry = "DELETE FROM $db_table WHERE username='$username' and ctime='$time' and message='$message'";

      if(!mysqli_query($this->connection,$qry))
      {
          $this->HandleError("Error deleting the message");
          return false;
      }
    
      return true;
    }

	}
?>