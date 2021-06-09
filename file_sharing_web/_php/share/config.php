<?php 
require_once(_mydir."_php/share/share.php");

global $shm;
$shm = new Sharer($db_host,$db_username,$db_pwd,$db_name,'shared',$site_name);
?>