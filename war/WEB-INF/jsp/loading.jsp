<%@ page language="java" contentType="text/html; charset=UTF8"
	pageEncoding="UTF8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF8">
<script type="text/javascript" src="./js/jquery-1.6.4.min.js"></script>
<title>BIMP Simulator</title>
</head>
<body>
	<h1>LOADING ...</h1>
	<h2 class="status"></h2>
	<script type="text/javascript">
		$(document).ready(function() {
			 getStatus = function() {
				timer += interval;
				if (timer > 10000) {
					clearInterval(timerId);
					window.location = "/getResults";
				}
				$.ajax({
					contentType : 'application/json',
					type : 'post',
					url : '/getStatus',
					success : function(data) {
						console.log("Status: ", data.status);
						$(".status").text(data.status);
						if (data.status == "FINISHED") {
							clearInterval(timerId);
							console.log("FINISHED");
							window.location = "/getResults";
						} else {
							console.log(data.status);
						}
					},
					error : function(e) {
						console.log(e);
						clearInterval(timerId);
					}

				})
			};
			var interval = 500;
			var timerId = setInterval("getStatus()", interval);
			var timer = 0;
		});
	</script>
</body>
</html>