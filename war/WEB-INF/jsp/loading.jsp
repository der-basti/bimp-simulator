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
	<script type="text/javascript">
		$(document).ready(function (){
			function getStatus() {$.ajax({
				contentType: 'application/x-javascript',
				type: 'post',
				url: '/getStatus',
				success : function(data) {
					var status = $.parseJSON(data);
					if(status=="FINISHED") {
						clearTimeour(timerId);
						alert("FINISHED");
					} else {
						console.log(status);
					}
				}	
			
			})};
			
			var timerId = setTimeout(getStatus(), 1000);
			
			
		});
	
	</script>
	</body>
</html>