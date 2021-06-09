<?php 
require_once(_mydir."_php/chats/chats.php");

global $chats;
$chats = new Chats($db_host,$db_username,$db_pwd,$db_name,'chats',$site_name);
?>