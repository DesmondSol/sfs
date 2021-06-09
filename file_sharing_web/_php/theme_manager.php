<?php 
	if(!isset($_SESSION)){
		session_start();
	}
	if(!isset($_SESSION['theme_color'])){
		$_SESSION['theme_color'] = 'dark';
	}
	if(isset($_REQUEST['act'])){
		$act = $_REQUEST['act'];
		if($act == 'get'){
			echo $_SESSION['theme_color'];
		} elseif($act == 'set'){
			$theme = isset($_REQUEST['theme']);
			if($theme){
				$theme = $_REQUEST['theme'];
				if($theme == "dark" or $theme == "light") {
					$theme = $theme;
				} else {
					$theme = 'dark';
				}
			} else {
				$theme = 'dark';
			}
			$_SESSION['theme_color'] = $theme;  
			echo $_SESSION['theme_color'];
		} else {
			echo $_SESSION['theme_color'];
		}
	} else {
		echo $_SESSION['theme_color'];
	}
?>