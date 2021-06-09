<?php 

	/**
	 * Commenting, for reports and also comments
	 */
	define("_mydir", "../");

	require_once './info.php';

	$dbh = $GLOBALS['db_host']; // HostName
	$dbu = $GLOBALS['db_username']; // Username
	$dbp = $GLOBALS['db_pwd']; // Password
	$dbn = $GLOBALS['db_name']; // Name
	$dbt = "comments";
	$act = isset($_POST['act']) ? $_POST['act'] : "comment";
	$errorformvars = empty($_POST['name']) or empty($_POST['message']) or empty($_POST['id']) or empty($_POST['username']) or empty($_POST['link']) or empty($_POST['type']) or empty($_POST['from']);
	$connection = mysqli_connect($dbh,$dbu,$dbp,$dbn);
	$conn = new PDO("mysql:host=$dbh;dbname=$dbn",$dbu, $dbp);

	function HandleError($str){
		echo "[\"ERROR\",\"$str\"]";
		die();
	}

	function CreateTable(){
		$n = $GLOBALS['dbt'];
		$c = $GLOBALS['connection'];
		$qry = "Create Table IF NOT EXISTS $n (".
	          "name VARCHAR( 30 ) NOT NULL ,".
	          "message Text NOT NULL ,".
	          "id int NOT NULL ,".
	          "type VARCHAR( 16 ) NOT NULL ,".
	          "link VARCHAR( 255 ) NOT NULL ,".
	          "subject VARCHAR( 30 ) NOT NULL ,".
	          "from_user VARCHAR( 16 ) NOT NULL ,".
	          "username VARCHAR( 16 ) NOT NULL".
	          ")";
            
    if(!mysqli_query($c,$qry))
    {
        HandleError("Error creating the table \nquery was\n $qry");
        return false;
    }
    return true;
	}

	function SendMail($name,$id,$type,$username,$from,$message,$link){
		$n = $GLOBALS['dbt'];
		$c = $GLOBALS['connection'];
		$qry = 'insert into '.$n.'(
            name,
            message,
            id,
            type,
            link,
            subject,
            from_user,
            username
            )
            values
            (
            "'.$name.'",
            "'.$message.'",
            "'.$id.'",
            "'.$type.'",
            "'.$link.'",
            "'.$GLOBALS['act'].'",
            "'.$from.'",
            "'.$username.'"
          	)';
            
    if(!mysqli_query($c,$qry))
    {
        HandleError("Error sending message");
        return false;
    }
		return true;
	}

	function getComments(){
		$conn = $GLOBALS['conn'];
		$n = $GLOBALS['dbt'];
		$qry = "SELECT * FROM ".$n;

		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $stmt = $conn->prepare($qry); 
    $stmt->execute();
    $result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
    
    if(!$result)
    {
        HandleError("Error fetching data");
        return false;
    }

    $result = $stmt->fetchAll();

    if(count($result) <= 0)
    {
        HandleError("There are no records yet");
        return false;
    }
  
    return $result;
	}
	
	if(CreateTable()){
		if($act == "report" or $act == "comment"){
			if($errorformvars){
				HandleError("Error, something is empty");
			} else {};
			if(SendMail($_POST['name'],$_POST['id'],$_POST['type'],$_POST['username'],
			$_POST['from'],$_POST['message'],$_POST['link'])){
				echo "[\"Success\",\"sent $act\"]";
			}
		} else {
			echo json_encode(getComments());
		}
	}
?>