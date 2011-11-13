<%@ page language="java" contentType="text/html; charset=UTF8"
	pageEncoding="UTF8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF8">
	<script type="text/javascript" src="./js/jquery-1.6.4.min.js"></script>
	<script type="text/javascript" src="./js/jquery-ui-1.8.16.custom.min.js"></script>
	<script type="text/javascript" src="./js/javascript.js"></script>
	<script type="text/javascript" src="https://apis.google.com/js/plusone.js"></script>
	
	
	<link rel="stylesheet" type="text/css" href="./css/style.css"></link>
	<link rel="stylesheet" type="text/css" href="./css/jquery-ui-1.8.16.custom.css"></link>
	<link href='http://fonts.googleapis.com/css?family=Open+Sans:300' rel='stylesheet' type='text/css'>
	<title>BIMP Simulator</title>
</head>
<body>
	<div id="main">
		<jsp:include page="_header.jsp"></jsp:include>
		<div id="contactPage" class="contents">
			<h1>CONTACT</h1>
			<div id="emailAdress">
				<h2>You can contact us via e-mail:</h2>
				E-mail: <a href= "mailto:madis@edit.ee">madis [at] edit [dot] ee</a>
			</div>
			<div id="contactForm">
			<h2>Or contact us via this form:</h2>
			<fieldset class="gill-font">
				<legend>Contact Form</legend>
				<form action="mailto:some.thing@mail.com" method="post" enctype="text/plain">
				<ul>
					<li>
						<label for="name">Name</label>
						<input type="text" name="name" id="name" size="30" />
					</li>
					<li>
						<label for="email">Email</label>
						<input type="text" name="email" id="email" size="30" />
					</li>
					<li>
						<label for="feedback">Leave your feedback or questions</label>
						<textarea cols="40" rows="6" name="feedback"></textarea>
					<li>
						<label>Numbers</label>
						<input type="text" id="txtCaptcha" class="captcha" disabled="disabled"/>
  				    	<input type="button" id="captchaRefresh" class="button smallButton" value="Refresh" />
  				    </li>
					<li>
						<label for="captcha">Please write the numbers shown above</label>
						<input type="text" id="txtInput"/> 
					</li>
					<li>
						<label for="submit">Send the form by clicking the button</label>
						<button id="submitContactForm" class="button smallButton">Send</button>
					</li>
				</ul>
				</form>
			</fieldset>
			</div>
		</div>
		<jsp:include page="_footer.jsp"></jsp:include>
	</div>
</body>
</html>