<?php 
	/**
	 * @author kevinj045/mohammed
	 * @version 3.1.7
	 * This file is for the client side scripting, is so important,
 	 * you can edit it if you want ;)
	 */
	class App
	{
		
		function __construct($sitename)
		{
			$this->name = $sitename;
			$GLOBALS['sitename'] = $sitename;
			$this->logo = _mydir.'res/favicon.png';
			$GLOBALS['sitelogo'] = $this->logo;
			$this->lgnm = $GLOBALS['lgnM'];
			if($this->lgnm->CheckLogin()){
				$pp = $_SESSION['pp_of_user']?$_SESSION['pp_of_user']:"default";
				$user = array(
					"name"=>$_SESSION['name_of_user'],
					"email"=>$_SESSION['email_of_user'],
					"university"=>$_SESSION['university_of_user'],
					"username"=>$_SESSION['username_of_user'],
					"pp"=>$pp,
				);
			} else {
				$user = array(
					"name"=>"user",
					"email"=>"email@gmail.com",
					"university"=>"caltech",
					"username"=>"user",
					"pp"=>"default"
				);
			}
			if($user['pp'] == "custom"){
				$user['pp'] = _mydir."userprofiles/".$user['username']."/pp.png";
			} else {
				$user['pp'] = _mydir."res/avatar.png";
			}
			$GLOBALS['user'] = $user;

			if(!isset($_SESSION['theme_color'])){
				$_SESSION['theme_color'] = 'dark';
			}

			echo "
				<script>
					window.BaseDir = \""._mydir."\";
					window.SiteName = \"".$sitename."\";
					window.SiteLogo = \"".$this->logo."\";
					window.isLoggedIn = \"".$this->lgnm->CheckLogin()."\";
					window.___user___ = {
						name: '".$user['name']."',
						email: '".$user['email']."',
						university: '".$user['university']."',
						username: '".$user['username']."',
						pp: '".$user['pp']."'
					}
				</script>
			";
		}

		function header(){
			// Header and start html
			echo '
			<!DOCTYPE html>
			<html>
			<head>
				<meta name="theme-color" content="#ffffff">
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>'.$this->name.'</title>
				<link rel="stylesheet" href="'._mydir.'css/fonts.css">
				<link rel="stylesheet" href="'._mydir.'css/m.t.css">
				<link rel="stylesheet" href="'._mydir.'css/app.css">
				<link rel="stylesheet" href="'._mydir.'css/theme-'.$_SESSION['theme_color'].'.css" id="ThemeCss">

				<link rel="icon" href="'.$this->logo.'">
			</head>
			<body>
			<main><div class="layout">
			';
			include _mydir."_views/head.php";
		}

		function mainStart(){
			// This function is if you want to make a change to the base container
			echo '<div class="babble">';	
		}

		function mainEnd(){
			echo "</div></div></main>";
		}

		function footer(){
			// Footer and end html
			include _mydir."_views/foot.php";
			echo '
			<script src="'._mydir.'js/jquery.js"></script>
			<script src="'._mydir.'js/m.t.js"></script>
			<script src="'._mydir.'js/module_manager.js"></script>
			<script src="'._mydir.'js/template.js"></script>
			<script src="'._mydir.'js/http.js"></script>
			<script src="'._mydir.'js/m.js"></script>
			<script src="'._mydir.'js/dbm.js"></script>
			<script src="'._mydir.'js/acn.js"></script>
			<script src="'._mydir.'js/java.js"></script>
			<script src="'._mydir.'js/routes.js"></script>
			<script src="'._mydir.'js/app.js"></script>
			</body>
			</html>
			';
		}
	}
?>