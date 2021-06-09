<?php
define('_mydir', '../../../');

require_once '../../info.php';
require_once '../config.php';

$dir = null !== _mydir ? _mydir : '../../../';

if($_POST['submitted']){
	if($lgnM->EmailResetPasswordLink()){
		echo "[\"success\"]";
	} else {
		$err = str_ireplace('<br />','',$lgnM->GetErrorMessage());
    $err = trim($err);
 		echo "[\"ERROR\",\"".$err."\"]";
	}
}

?>