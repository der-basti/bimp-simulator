<%@ page language="java" contentType="text/html; charset=UTF8"
	pageEncoding="UTF8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF8">
	<script type="text/javascript" src="./js/jquery-1.6.4.min.js"></script>
	<link rel="stylesheet" type="text/css" href="./css/style.css"></link>
	<title>BIMP Simulator</title>
</head>
<body>
	<div class="main">
		<jsp:include page="_header.jsp"></jsp:include>
		<div class="contents">
			<h1>LOADING ...</h1>
			<script type="text/javascript">
				$(document).ready(function() {
					function getStatus() {
						$.ajax({
							contentType : 'application/json',
							type : 'post',
							url : '/getStatus',
							success : function(data) {
								console.log("Status: ", data.status);
								if (data.status == "FINISHED") {
									clearInterval(timerId);
									console.log("FINISHED");
									window.location = "/getResults";
								} else {
									console.log(data.status);
								}
							}

						})
					}
					;
					var timerId = setInterval(getStatus(), 100);
				});
			</script>
		</div>
		<jsp:include page="_footer.jsp"></jsp:include>
	</div>
</body>
</html>