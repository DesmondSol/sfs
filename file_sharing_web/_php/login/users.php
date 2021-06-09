<?php
define('_mydir', '../../');

require_once '../info.php';
require_once 'config.php';
$dir = null !== _mydir ? _mydir : '../../';

$users = $lgnM->ListUsers();
if($users)
{	
  echo json_encode($users);
} else {
  $err = str_ireplace('<br />','',$lgnM->GetErrorMessage());
  $err = trim($err);
	echo "[\"ERROR\",\"".$err."\",\"error_from_auth\",\"error_login\"]";
}

?>