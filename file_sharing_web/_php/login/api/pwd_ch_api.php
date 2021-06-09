<?php define("_mydir", "../") ?>
<?php include '../_f/0.php'; ?>
<?PHP

if(!$fgmembersite->CheckLogin())
{
    $fgmembersite->RedirectToURL("login.php");
    exit;
}

if(isset($_POST['submitted']))
{
   if($fgmembersite->ChangePassword())
   {
        $fgmembersite->RedirectToURL("../index.php");
   }
}

?>
<?php $config->header('Change Password') ?>

  <?php $config->main('start') ?>

<form id='changepwd' action='<?php echo $fgmembersite->GetSelfScript(); ?>' method='post' accept-charset='UTF-8' class="register__text container">
<fieldset >
<div class="section-title">
    <h3>Change Password</h3>
</div>

<input type='hidden' name='submitted' id='submitted' value='1' class="hidden"/>

<div><span class='error'><?php echo $fgmembersite->GetErrorMessage(); ?></span></div>

<div class="register__form">
    <div class="form input">
          <input type='password' name='oldpwd' id='oldpwd' placeholder="Old Password*:"  maxlength="50">
          <div class="change__extension">
              Old Password
          </div>
      </div>
  </div>

  <div class="register__form">
    <div class="form input">
          <input type='password' name='newpwd' id='newpwd' placeholder="New Password*:"  maxlength="50">
          <div class="change__extension">
              New Password
          </div>
      </div>
  </div>
<br/><br/><br/>
<div class='container'>
    <input type='submit' name='Submit' value='Submit' class="site-btn"/>
</div>

</fieldset>
</form>

<?php $config->main('end') ?>

<?php $config->footer() ?>
	
	   