<%@ page language="java" contentType="text/html; charset=UTF8"
    pageEncoding="UTF8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF8">
	<link href='http://fonts.googleapis.com/css?family=Open+Sans:300' rel='stylesheet' type='text/css'>
	<link rel="stylesheet" type="text/css" href="./css/style.css"></link>
	<script type="text/javascript" src="https://www.google.com/jsapi"></script>
	<script type="text/javascript" src="./js/jquery-1.6.4.min.js"></script>
	<script type="text/javascript" src="./js/jquery-ui-1.8.16.custom.min.js"></script>
	<script type="text/javascript" src="./js/bimp.file.js"></script>
	<script type="text/javascript" src="./js/bimp.parse.js"></script>
	<script type="text/javascript" src="./js/bimp.forms.js"></script>
	<script type="text/javascript" src="./js/bimp.charts.js"></script>
	<script type="text/javascript" src="./js/javascript.js"></script>

	<title>BIMP Simulator results</title>
</head>
<body>
	<div id="main">
		<jsp:include page="_header.jsp"></jsp:include>
		<div id="contents" class="gill-font">
			<div id="duration-chart-div" class="chart"></div>
			<div id="waiting-time-chart-div" class="chart"></div>			
			<div id="cost-chart-div" class="chart"></div>	
			<div id="resources-chart-div" class="chart"></div>	
			<div id="download-div">
				<form id="hiddenDownloadForm" method="post" action="/file">
					<input type="hidden" id="download" name="download" />
					Download .bpmn file with simulation information: <button id="downloadBpmn" class="button">Download</button><br/>
					<c:if test="${enableLogDownload}">
						Download log: <button id="downloadLog" class="button">Download</button>
					</c:if> 
				</form>
			<form method="post" action="/getCsv">
				Download simulation report: <input type="submit" class="button" value="Download">
			</form>
			</div>
			<div id="results">
				<h3>Completed elements </h3> <fmt:formatNumber type="number" pattern="###,###.##" maxFractionDigits="2" value="${stats.completedElements }"/>
				<h3>Completed process instances </h3><fmt:formatNumber type="number" pattern="###,###.##" maxFractionDigits="2" value="${stats.completedProcesseInstances }"/>
				<h3>Maximum process cost </h3> <fmt:formatNumber type="number" pattern="###,###.##" maxFractionDigits="2" value="${stats.maxProcessCost }"/>
				<h3>Maximum process duration </h3> <fmt:formatNumber type="number" pattern="###,###.##" maxFractionDigits="2" value="${stats.maxProcessDuration }"/>
				<h3>Minimum process cost </h3> <fmt:formatNumber type="number" pattern="###,###.##" maxFractionDigits="2" value="${stats.minProcessCost}"/>
				<h3>Minimum process duration </h3><fmt:formatNumber type="number" pattern="###,###.##" maxFractionDigits="2" value="${stats.minProcessDuration }"/>
				<h3>Total cost </h3> <fmt:formatNumber type="number" pattern="###,###.##" maxFractionDigits="2" value="${stats.totalCost }"/>
				<h3>Total duration </h3><fmt:formatNumber type="number" pattern="###,###.##" maxFractionDigits="2" value="${stats.totalDuration }"/>
				<br />
			</div>
			<div id="result-table">
			<table border="0">
				<tr>
					<th>Description</th>
					<th>Average cost</th>
					<th>Average duration</th>
					<th>Average idle time</th>
					<th>Average waiting time</th>
				</tr>
				<c:forEach var="element" items="${elements}">
					<tr>
						<td>${element.description }</td>
						<td>${element.avgCost }</td>
						<td>${element.avgDuration }</td>
						<td>${element.avgIdle }</td>
						<td>${element.avgWaiting }</td>
					</tr>
				</c:forEach>
			</table>
			</div>
		</div>
		<jsp:include page="_footer.jsp"></jsp:include>
	</div>
	
	<script>
	var durationIntervals = ${durationIntervals};
	var durationCounts = ${durationCounts};
	var waitingTimeIntervals = ${waitingTimeIntervals};
	var waitingTimeCounts = ${waitingTimeCounts};
	var costIntervals = ${costIntervals};
	var costCounts = ${costCounts};
	var resources = ${resources};
	var utilization = ${utilization};
	google.setOnLoadCallback(drawDurationsChart);
	google.setOnLoadCallback(drawWaitingTimesChart);
	google.setOnLoadCallback(drawCostsChart);
	google.setOnLoadCallback(drawResourcesChart);

	</script>
</body>
</html>
