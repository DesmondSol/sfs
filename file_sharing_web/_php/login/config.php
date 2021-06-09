<?PHP
require_once(_mydir."_php/login/login.php");

global $lgnM;
$lgnM = new loginManager();

//Provide your site name here
$lgnM->SetWebsiteName($site_url);

//Provide the email address where you want to get notifications
$lgnM->SetAdminEmail($site_email);


$sql__db__create = new mysqli($db_host,$db_username,$db_pwd);
$sql__db__create->query('CREATE DATABASE IF NOT EXISTS '.$db_name);
//Provide your database login details here:
//hostname, user name, password, database name and table name
//note that the script will create the table (for example, users in this case)
//by itself on submitting register.php for the first time
$lgnM->InitDB(/*hostname*/$db_host,
                      /*username*/$db_username,
                      /*password*/$db_pwd,
                      /*database name*/$db_name,
                      /*table name*/'users');

//For better security. Get a random string from this link: http://tinyurl.com/randstr
// and put it here
$lgnM->SetRandomKey('qSRcVS6DrTzrPvr');

?>