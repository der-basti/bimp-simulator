<%@ page language="java" contentType="text/html; charset=UTF8"
    pageEncoding="UTF8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF8">
	<link href='http://fonts.googleapis.com/css?family=Open+Sans:300' rel='stylesheet' type='text/css'>
	<link rel="stylesheet" type="text/css" href="./css/style.css"></link>

	<title>BIMP Simulator results</title>
</head>
<body>
	<div id="main">
		<jsp:include page="_header.jsp"></jsp:include>
		<div id="contents">
			<div id="results">
				<h3>Completed elements </h3> ${stats.completedElements } <br />
				<h3>Completed process instances </h3> ${stats.completedProcesseInstances } <br />
				<h3>Maximum process cost </h3> ${stats.maxProcessCost } <br />
				<h3>Maximum process duration </h3> ${stats.maxProcessDuration } <br />
				<h3>Minimum process cost </h3> ${stats.minProcessCost } <br />
				<h3>Minimum process duration </h3>${stats.minProcessDuration } <br />
				<h3>Total cost </h3> ${stats.totalCost } <br />
				<h3>Total duration </h3>${stats.totalDuration } <br />
				<br />
			</div>
			<table border="1">
				<tr>
					<td>Description</td>
					<td>Total Cost</td>
					<td>Total Duration</td>
					<td>Total Idle</td>
					<td>Total Waiting</td>
				</tr>
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