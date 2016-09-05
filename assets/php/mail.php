<?php

	$name = $_POST['name'];
	$email = $_POST['email'];


	$subject = $_POST['subject'];
	$subject = str_replace(array("\r","\n"),array(" "," "), $subject);
	$message = $_POST['message'];
	$formcontent="From: $name - eMail: $email \n Subject: $subject \n Message: \n $message";
	$recipient = "contact@michapau.net";
	//$mailheader = "From: contact@michapau.net \r\n";
	$headers   = array();
	$headers[] = "MIME-Version: 1.0";
	$headers[] = "Content-type: text/plain; charset=iso-8859-1";
	$headers[] = "Bcc: michael_kittenberger@yahoo.fr";
	$headers[] = "Subject: mail from webpage";
	$headers[] = "X-Mailer: PHP/".phpversion();
	if(isset($_POST['url']) && $_POST['url'] == ''){
		$mail_ret = mail($recipient, $subject, $formcontent, implode("\r\n", $headers)) or die("Error!");
	} else {
		$mail_ret = 0;
	}
	echo $mail_ret;
?>
