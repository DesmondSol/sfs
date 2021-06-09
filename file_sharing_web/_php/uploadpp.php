<?php 
	define('_mydir', '../');

	require_once(_mydir."_php/info.php");
	require_once(_mydir."_php/login/config.php");
	if(!isset($_SESSION))
	{
		session_start();
	}

	if(!move_uploaded_file($_FILES['files']['tmp_name'][0], '../userprofiles/'.
		$lgnM->UserName()
		.'/pp.png')){
    echo "error";
  } else {
  	$lgnM->setPP('custom');
  	echo "success";
  }
  
?>