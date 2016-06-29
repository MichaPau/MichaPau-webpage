<?php
	
	$name = $_POST['name'];
	$email = $_POST['email'];
	/*if( $_POST['email'] && !preg_match( "/[\r\n]/", $_POST['email']) ) {
		$email = $_POST['email'];
	} else {
		$email = "contact@michapau.net";
	}*/
	
	$subject = $_POST['subject'];
	$message = $_POST['message'];
	$formcontent="From: $name - eMail: $email \n Message: \n $message";
	$recipient = "contact@michapau.net, michael_kittenberger@yahoo.fr";
	$mailheader = "From: contact@michapau.net \r\n";
	if(isset($_POST['url']) && $_POST['url'] == ''){
		$mail_ret = mail($recipient, $subject, $formcontent, $mailheader) or die("Error!");
	} else {
		$mail_ret = 0;
	}
	echo $mail_ret;
?>