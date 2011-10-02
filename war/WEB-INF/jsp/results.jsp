<%@ page language="java" contentType="text/html; charset=UTF8"
    pageEncoding="UTF8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF8">
	<link rel="stylesheet" type="text/css" href="./css/style.css"></link>

	<title>BIMP Simulator results</title>
</head>
<body>
	<div class="main">
		<jsp:include page="_header.jsp"></jsp:include>
		<div class="contents">
			<div class="results">
				${stats.completedElements } <br />
				${stats.completedProcesseInstances } <br /> ${stats.maxProcessCost
				} <br /> ${stats.maxProcessDuration } <br />
				${stats.minProcessCost } <br /> ${stats.minProcessDuration } <br />
				${stats.totalCost } <br /> ${stats.totalDuration } <br />
			</div>
			<table border="1">
				<c:forEach var="element" items="${elements}">
					<tr>
						<td>${element.description }</td>
						<td>${element.totalCost }</td>
						<td>${element.totalDuration }</td>
						<td>${element.totalIdle }</td>
						<td>${element.totalWaiting }</td>
					</tr>
				</c:forEach>
			</table>
		</div>
		<jsp:include page="_footer.jsp"></jsp:include>
	</div>
</body>
</html>