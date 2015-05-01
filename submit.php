<?php
include_once "vendor/autoload.php";

/*
* Create the body of the message (a plain-text and an HTML version).
* $text is your plain-text email
* $html is your html version of the email
* If the reciever is able to view html emails then only the html
* email will be displayed
*/
$text = $_POST['message'];
$html = $_POST['message'];

// This is your From email address

$from = array(
	$_POST['email'] => $_POST['name']
);

// Email recipients

$to = array(
	'me@aarondancer.com' => 'Aaron Dancer'

// Email subject

$subject = $_POST['subject'];

// Login credentials

$username = getenv('SGUSER');
$password = getenv('SGPASS');

// Setup Swift mailer parameters

$transport = Swift_SmtpTransport::newInstance('smtp.sendgrid.net', 587);
$transport->setUsername($username);
$transport->setPassword($password);
$swift = Swift_Mailer::newInstance($transport);

// Create a message (subject)

$message = new Swift_Message($subject);

// attach the body of the email

$message->setFrom($from);
$message->setBody($html, 'text/html');
$message->setTo($to);
$message->addPart($text, 'text/plain');

// send message

if ($recipients = $swift->send($message, $failures)) {

	// This will let us know how many users received this message

	echo 'Message sent out to ' . $recipients . ' users';
}

// something went wrong =(

else {
	echo "Something went wrong - ";
	print_r($failures);
}