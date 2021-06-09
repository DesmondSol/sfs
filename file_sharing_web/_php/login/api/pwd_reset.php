<?php define("_mydir", "../") ?>
<?php include '../_f/0.php'; ?>
<?php
$emailsent = false;
if(isset($_POST['submitted']))
{
   if($fgmembersite->EmailResetPasswordLink())
   {
        $fgmembersite->RedirectToURL("../index.php");
        exit;
   }
}

?>

<?php $config->header('Reset Password') ?>

  <?php $config->main('start') ?>

<form id='resetreq' action='<?php echo $fgmembersite->GetSelfScript(); ?>' method='post' accept-charset='UTF-8' class="register__text container">
  <fieldset >
  <div class="section-title">
      <h3>Reset Password</h3>
  </div>

  <input type='hidden' name='submitted' id='submitted' value='1' hidden="" class="hidden"/>

  <div><span class='error'><?php echo $fgmembersite->GetErrorMessage(); ?></span></div>
  <div class="register__form">
    <div class="form input">
          <input type="email" placeholder="Your Email*:" name='email' id='email' maxlength="50" value='<?php echo $fgmembersite->SafeDisplay('email') ?>'>
          <div class="change__extension">
              Your Email
          </div>
      </div>
  </div>
  <div class='short_explanation text-center'>A link to reset your password will be sent to the email address</div>
  <div class='container'>
      <input type='submit' name='Submit' value='Submit' class="site-btn" />
  </div>

  </fieldset>
</form>

<?php $config->main('end') ?>

<?php $config->footer() ?>