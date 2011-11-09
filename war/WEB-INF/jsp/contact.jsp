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
	
	<link rel="stylesheet" type="text/css" href="./css/style.css"></link>
	<link rel="stylesheet" type="text/css" href="./css/jquery-ui-1.8.16.custom.css"></link>
	<link href='http://fonts.googleapis.com/css?family=Open+Sans:300' rel='stylesheet' type='text/css'>
	<title>BIMP Simulator</title>
</head>
<body>
	<div id="main">
		<jsp:include page="_header.jsp"></jsp:include>
		<div id="uploadPage" class="contents">
			<h1>Contact</h1>
			<div id="emailAdress">
				<h2>You can contact us via e-mail:</h2>
				E-mail: <a href= "mailto:some.thing@mail.com">some [dot] thing [at] mail [dot] com</a>
			</div>
			<table>
				<tr>
    				<td>
        				Welcome To Captcha<br />
    				</td>
				</tr>
				<tr>
    				<td>
     					<input type="text" id="txtCaptcha" class="captcha"/>
  				    	<input type="button" id="btnrefresh" value="Refresh" onclick="DrawCaptcha();" />
  					</td>
				</tr>
				<tr>
   					<td>
      					<input type="text" id="txtInput"/>    
    				</td>
				</tr>
				<tr>
    				<td>
        				<input id="Button1" type="button" value="Check" onclick="alert(ValidCaptcha());"/>
   					</td>
				</tr>
		</table>
		
		</div>
		<jsp:include page="_footer.jsp"></jsp:include>
	</div>
</body>
</html>