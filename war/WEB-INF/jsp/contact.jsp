<%@ page language="java" contentType="text/html; charset=UTF8"
	pageEncoding="UTF8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF8">
	<script type="text/javascript" src="./js/jquery-1.7.1.min.js"></script>
	<script type="text/javascript" src="./js/jquery-ui-1.8.18.custom.min.js"></script>
	<script type="text/javascript" src="./js/javascript.js"></script>
	<script type="text/javascript" src="https://apis.google.com/js/plusone.js"></script>
	
	
	<link rel="stylesheet" type="text/css" href="./css/style.css"></link>
	<link rel="stylesheet" type="text/css" href="./css/jquery-ui-1.8.18.custom.css"></link>
	<link href='http://fonts.googleapis.com/css?family=Open+Sans:300' rel='stylesheet' type='text/css'>
	<title>BIMP Simulator</title>
</head>
<body>
	<div id="main">
		<jsp:include page="_header.jsp"></jsp:include>
		<div id="contactPage" class="contents">
			<div id="contact-info">
				<h1>CONTACT</h1>
				<div id="emailAdress">
					<h2>You can contact us via e-mail:</h2>
					E-mail: <a href= "mailto:madis[at]edit[dot]ee">madis [at] edit [dot] ee</a>
				</div>
			</div>
			<div id="facebook-box">
				<div class="fb-like-box" data-href="http://www.facebook.com/pages/BIMP-Business-Process-Simulator/293028094050864" 
							data-width="500" data-height="500" data-show-faces="true" data-stream="true" data-header="true"></div>
			</div>
		</div>
		<jsp:include page="_footer.jsp"></jsp:include>
	</div>
</body>
</html>