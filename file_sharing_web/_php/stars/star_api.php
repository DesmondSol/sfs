<?php 
define('_mydir', '../../');

require_once '../info.php';
require_once '../login/config.php';
require_once './config.php';
$dir = null !== _mydir ? _mydir : '../../';

$act = isset($_REQUEST['act']) ? $_REQUEST['act'] : 'get';
$act = strtolower($act);

if($act == 'get'){
	echo $sm->getStars();
} elseif($act == 'star'){
	if(isset($_REQUEST['user']))
	{
		echo $sm->starUser($_REQUEST['user']);
	} else {
		echo "";
	}
} elseif($act == 'unstar'){
	if(isset($_REQUEST['user']))
	{
		echo $sm->unstarUser($_REQUEST['user']);
	} else {
		echo "";
	}
} elseif($act == 'getuseracc'){
	if(isset($_REQUEST['user']))
	{
		echo json_encode($sm->getUserAccount($_REQUEST['user']));
	} else {
		echo "";
	}
} elseif($act == 'isstarred'){
	if(isset($_REQUEST['user']))
	{
		echo $sm->isStarred($_REQUEST['user']) ? "true" : "false";
	} else {
		echo "false";
	}
} elseif($act == 'getstarred'){
	echo json_encode($sm->getStarred());
} else {	
	echo $sm->getStars();
}

?>