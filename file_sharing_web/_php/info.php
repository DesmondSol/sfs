<?php
/**
	* @author kevinj045/mohammed
	* @version 2.6.8
	* This file is the informations needed in the app, which is extacted 
	* from the manifest.json file in the home dir
*/
// you should not change the informations from here

$manifest_json = json_decode(file_get_contents(_mydir."manifest.json"));

$site_url = $manifest_json->siteurl;
$site_name = $manifest_json->name;
$site_email = $manifest_json->email;
// these are the database informations, should be changed
$db_host = "localhost";
$db_username = "root";
$db_pwd = "";
$db_name = $manifest_json->shortname; // DB name is the same as the app name, you can change that
?>