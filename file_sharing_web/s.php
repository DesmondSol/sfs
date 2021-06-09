<?php
$to = 'droun@localhost.com';
$subject = 'Hello from XAMPP!';
$message = 'This is a test';
$headers = "From: droun@localhost\r\n";
if (mail($to, $subject, $message, $headers)) {
   echo "SUCCESS";
} else {
   echo "ERROR";
}