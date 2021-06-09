<?PHP
require_once(_mydir."_php/stars/stars.php");

global $sm;
$sm = new StarsManager();

//Provide your site name here
$sm->SetWebsiteName($site_url);

//Provide the email address where you want to get notifications
$sm->SetAdminEmail($site_email);

//Provide your database login details here:
//hostname, user name, password, database name and table name
//note that the script will create the table (for example, users in this case)
//by itself on submitting register.php for the first time
$sm->InitDB(/*hostname*/$db_host,
                      /*username*/$db_username,
                      /*password*/$db_pwd,
                      /*database name*/$db_name,
                      /*table name*/'users');

//For better security. Get a random string from this link: http://tinyurl.com/randstr
// and put it here
$sm->SetRandomKey('qSRcVS6DrTzrPvr');

$sm->DBLogin();

?>