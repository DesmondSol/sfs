<?php
define('_mydir', '../../../');

require_once '../../info.php';
require_once '../config.php';

$dir = null !== _mydir ? _mydir : '../../../';

if(isset($_GET['code']))
{
   if($lgnM->ConfirmUser())
   {
       echo "[\"success\"]";
   } else {
	   	$err = str_ireplace('<br />','',$lgnM->GetErrorMessage());
	    $err = trim($err);
   		echo "[\"ERROR\",\"".$err."\"]";
   }
}

?>