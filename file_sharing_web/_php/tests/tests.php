<?php 
	
	/**
	 * @author kevinj045/me
	 * @version 1.0.0
	 * @see the share manager
	 * The first time i make this, 
	 */
	
	require_once(_mydir."_php/login/formvalidator.php");
	class TestManager
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
              "id_test INT NOT NULL AUTO_INCREMENT ,".
              "username VARCHAR( 16 ) NOT NULL ,".
              "name VARCHAR( 128 ) NOT NULL ,".
              "about VARCHAR( 300 ) NOT NULL ,".
              "link VARCHAR( 2000 ) NOT NULL ,".
              "university VARCHAR( 255 ) NOT NULL ,".
              "catagory VARCHAR( 255 ) NOT NULL ,".
              "type VARCHAR( 255 ) NOT NULL ,".
              "subject VARCHAR( 255 ) NOT NULL ,".
              "year VARCHAR( 6 ) NOT NULL ,".
              "PRIMARY KEY ( id_test )".
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
                username,
                name,
                about,
                link,
                university,
                catagory,
                type,
                subject,
                year
                )
                values
                (
                "' . $this->SanitizeForSQL($formvars['username']) . '",
                "' . $this->SanitizeForSQL($formvars['name']) . '",
                "' . $formvars['about'] . '",
                "' . $this->SanitizeForSQL($formvars['link']) . '",
                "' . $this->SanitizeForSQL($formvars['university']) . '",
                "' . $this->SanitizeForSQL($formvars['catagory']) . '",
                "' . $this->SanitizeForSQL($formvars['type']) . '",
                "' . $this->SanitizeForSQL($formvars['subject']) . '",
                "' . $this->SanitizeForSQL($formvars['year']) . '"
                )';
      if(!mysqli_query( $this->connection, $qry))
      {
          $this->HandleError("Error inserting data to the table\nquery:$qry");
          return false;
      }  
      return true;
		}

		function Share(){
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
				$this->HandleError('Error Putting your post to the database, retry');
				return false;
			}

      $this->lgnm->Post();

			return true;
		}

		function deletePost($id,$username){
      $db_table = $this->DB['table'];
      $qry = "DELETE FROM $db_table WHERE username='$username' and id_post=$id";

      if(!mysqli_query($this->connection,$qry))
      {
          $this->HandleError("Error deleting the post");
          return false;
      }

      $this->lgnm->Post('sub');

      return true;
    }

		function InsertInfo(){
			if(!isset($_SESSION))
			{
				session_start();
			}

			if(!isset($_SESSION['username_of_user']) 
					or !isset($_SESSION['university_of_user'])){
				$this->HandleError('Error, Couldn\'t find username or university of user');
				return false;
			}

			$this->formvars['username'] = $_SESSION['username_of_user'];
			$this->formvars['university'] = $_SESSION['university_of_user'];
			return true;
		}

		function ValidateSubmission()
    {
        
        $validator = new FormValidator();
        $validator->addValidation("name","req","Please fill in Name");
        $validator->addValidation("about","req","About is important to tell about the test");
        $validator->addValidation("link","req","Link is very required");
        $validator->addValidation("catagory","req","Your test must be catagorized, put the catagory");
        $validator->addValidation("type","req","Your test must be catagoried to a type");
        $validator->addValidation("subject","req","Your test must be catagorized, put the subject");
        $validator->addValidation("year","req","They year of the test, like 2011,2020...");

        
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
        $this->formvars['about'] = $_POST['about'];
        $this->formvars['link'] = $this->Sanitize($_POST['link']);
        $this->formvars['catagory'] = $this->Sanitize($_POST['catagory']);
        $this->formvars['type'] = $this->Sanitize($_POST['type']);
        $this->formvars['subject'] = $this->Sanitize($_POST['subject']);
        $this->formvars['year'] = $this->Sanitize($_POST['year']);
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

    function displayEntries(){
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

	}

?>
