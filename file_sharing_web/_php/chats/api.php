<?php 
define('_mydir', '../../');

require_once '../info.php';
require_once '../login/config.php';
require_once './config.php';
$dir = null !== _mydir ? _mydir : '../../';

if(isset($_POST['act']))
{	
	$act = $_POST['act']; // Action
	if($act == "send"){
		if($chats->sendMessage())
	   {	
	      echo "[\"success\",\"\",\"\"]";
	   } else {
	      $err = str_ireplace('<br />','',$chats->GetErrorMessage());
	      $err = trim($err);
	      echo "[\"ERROR\",\"".$err."\",\"error_from_auth\",\"error_share\"]";
	   }
	} elseif($act == 'delete'){
		if(!$chats->deleteMessage($_POST['time'],$_POST['username'],$_POST['message'])){
			$err = str_ireplace('<br />','',$chats->GetErrorMessage());
      $err = trim($err);
      echo "[\"ERROR\",\"".$err."\",\"error_from_auth\",\"error_share\"]";
		} else {
			echo "[\"success\"]";
		}
	} else {
		$result = $chats->getAllChats();
		if($result){
			echo json_encode($result);
		} else {
	      $err = str_ireplace('<br />','',$chats->GetErrorMessage());
	      $err = trim($err);
	      echo "[\"ERROR\",\"".$err."\",\"error_from_auth\",\"error_share\"]";
	   }
	}
}

?>