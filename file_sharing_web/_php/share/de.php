<?php 
/**
 *  @author kevinj04/me
 *  @version 2.8.1
 *  DE.php or DisplayEntries.php
 */

define('_mydir', '../../');

require_once '../info.php';
require_once '../login/config.php';
require_once './config.php';
$dir = null !== _mydir ? _mydir : '../../';

$entries = $shm->displayEntries();
if($entries)
{	
  echo json_encode($entries);
} else {
  $err = str_ireplace('<br />','',$shm->GetErrorMessage());
  $err = trim($err);
  echo "[\"ERROR\",\"".$err."\",\"error_from_auth\",\"error_share\"]";
}
?>