<?php 
require_once(_mydir."_php/tests/tests.php");

global $tests;
$tests = new TestManager($db_host,$db_username,$db_pwd,$db_name,'tests_shared',$site_name);
?>