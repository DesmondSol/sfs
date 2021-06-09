<?php 
define('_mydir', '../../');

require_once '../info.php';
require_once '../login/config.php';
require_once './config.php';
$dir = null !== _mydir ? _mydir : '../../';

if(isset($_POST['act']))
{	
	$act = $_POST['act']; // Action
	if($act == 'post'){
	  if($tests->Share())
	  {	
	    echo "[\"success\",\"\",\"\"]";
	  } else {
	    $err = str_ireplace('<br />','',$tests->GetErrorMessage());
	    $err = trim($err);
	    echo "[\"ERROR\",\"".$err."\",\"error_from_auth\",\"error_share\"]";
	  }
	} elseif($act == 'delete'){
		if(!$shm->deletePost($_POST['id'],$_POST['username'])){
			$err = str_ireplace('<br />','',$shm->GetErrorMessage());
      $err = trim($err);
      echo "[\"ERROR\",\"".$err."\",\"error_from_auth\",\"error_share\"]";
		} else {
			echo "[\"success\"]";
		}
	} elseif ($act == 'get') {
		$result = $tests->displayEntries();
		if($result)
	  {	
	    echo json_encode($result);
	  } else {
	    $err = str_ireplace('<br />','',$tests->GetErrorMessage());
	    $err = trim($err);
	    echo "[\"ERROR\",\"".$err."\",\"error_from_auth\",\"error_share\"]";
	  }
	} else {

	}
}

?>