<%@ page language="java" contentType="text/html; charset=UTF8"
	pageEncoding="UTF8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF8">
<link rel="stylesheet" type="text/css" href="./css/style.css"></link>
<link href='http://fonts.googleapis.com/css?family=Open+Sans:300' rel='stylesheet' type='text/css'>
<title>BIMP Simulator</title>
<script type="text/javascript" src="./js/jquery-1.6.4.min.js"></script>
<script type="text/javascript" src="https://www.google.com/jsapi"></script>
<script type="text/javascript" src="./js/bimp.charts.js"></script>
</head>
<body>
	<div id="main">
		<jsp:include page="_header.jsp"></jsp:include>
		<div id="contents">
			<div id="chart_div">
			</div>
			<div id="introduction">
				<b>Bimp is a business process simulator.</b><br> 
				It takes a file written in Business Process Modeling Notation – usually generated 
				from a Business Process Diagram – allows you to add simulation-relevant information 
				and then outputs resource utilization statistics.
			</div>
			<div id="uploadpageButtonBox">
				<a id="uploadpageButton" href="/upload">Continue to upload page</a>
			</div>
		</div>
		<jsp:include page="_footer.jsp"></jsp:include>
	</div>
</body>
</html>