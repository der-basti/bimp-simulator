<%@ page language="java" contentType="text/html; charset=UTF8" pageEncoding="UTF8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="simulationReports" value="${testReport.simulationReports}" />
<html>
	<head>
		<title>Test report</title>
		<script type="text/javascript" src="./js/jquery-1.7.1.min.js"></script>
		<script type="text/javascript" src="./js/jquery-ui-1.8.18.custom.min.js"></script>
		<link rel="stylesheet" type="text/css" href="./css/jquery-ui-1.8.18.custom.css"></link>
	</head>
	<body>
		<div class="main">
				<table>
					<thead>
						<tr>
							<th colspan="13">
								<h3>Test report</h3>
								<h4>Date: ${simulationReports[0].formattedStartDate}</h4>
							</th>
						</tr>
						<tr>
							<th>File name</th>
							<th>Total duration</th>
							<th>1</th>
							<th>2</th>
							<th>3</th>
							<th>4</th>
							<th>5</th>
							<th>6</th>
							<th>7</th>
							<th>8</th>
							<th>9</th>
							<th>10</th>
							<th>11</th>
						</tr>
					</thead>
					<tbody>
						<c:forEach items="${simulationReports}" var="report">
							<tr class=''>
								<td class="<c:if test="${report.hasError}">nok</c:if>"><p class="filename">${report.fileName}</p></td>
								<td>${report.duration} s</td>
								<c:forEach items="${report.events}" var="event">
									<td class="event <c:if test="${event.errorCode != 0}">nok</c:if>"
										title="${event.name}"
										data-duration="${event.duration}" 
										data-errormessage='${event.errorMessage}' 
										data-stacktrace='${event.stackTrace}' 
										data-errorcode="${event.errorCode}"
										data-eventname='${event.name}'>
										${event.duration}
									</td>
								</c:forEach>
							</tr>
						</c:forEach>
					</tbody>
				</table>
				<table>
					<thead>
						<tr>
							<th>
								<h4>Summary</h4>
							</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Status:</td>
							<td class="colorize">${testReport.successfulTestsCount}/${testReport.fileCount}</td>
							<td class="colorize">${testReport.successPercentage}%</td>
						</tr>
						<tr>
							<td>Total duration:</td>
							<td>${testReport.testDuration} s</td>
						</tr>
						<tr>
							<td rowspan="2" colspan="3">
								Completed events:
							</td>
							<th>1</th>
							<th>2</th>
							<th>3</th>
							<th>4</th>
							<th>5</th>
							<th>6</th>
							<th>7</th>
							<th>8</th>
							<th>9</th>
							<th>10</th>
							<th>11</th>
						</tr>
						<tr>
							<c:forEach items="${testReport.successfulEventsCount}" var="eventCount" varStatus="i">
								<td title="${testReport.eventNames[i.index]}"class="colorize">${eventCount}/${testReport.fileCount}</td>
							</c:forEach>
						</tr>
					</tbody>
				</table>
			</div>
	</body>
</html>

<style>
body {
	font-size: 12px;
	background-color: rgb(245,245,240);
}
table {
	border-collapse: collapse;
	font-family: Tahoma;
	font-size: 12px;
	text-align: center;
	color: #005F6B;
	margin-bottom: 20px;
}

td {
	border-top: 1px solid #F7F9FE;
	border-right: 1px solid #F7F9FE;
	padding: 5px;
}

th {
	background-color: #BED2D9;
	padding-left: 4px;
	padding-right: 4px;
}

tr:nth-child(even) {
	background-color: #DCE8EB;
}

tr:nth-child(odd) {
	background-color: #ECF1F2;
}

tr:hover {
	background-color: #D3E2B6;
}
p.filename {
	width: 175px;
	word-wrap: break-word;
}

td:first-child,th:first-child {
	
}
.main {
	width: 850px;
	margin-left: auto;
	margin-right: auto;
}
.nok {
	background-color: #FC3A51;
	color: #230F2B;
}
.nok:hover {
	cursor: pointer;
}
tr.error {
	background-color: #FF8C94;
	color: #0E2430;
}
.vertical-text {
 	-webkit-transform: rotate(90deg);
/* 	-moz-transform: rotate(60deg); */
/* 	-ms-transform: rotate(60deg); */
/* 	-o-transform: rotate(60deg); */
	transform: rotate(60deg);
}
</style>

<script>
	$(document).ready(function () {
		$(".event.nok").click(function () {
			var stackTrace = $(this).data("stacktrace"),
				errorMessage = $(this).data("errormessage");
			$("<div style='height: 200px; overflow-x: hidden; '></div>").append("<strong>" + errorMessage + "</strong>").append("<p>" + stackTrace + "</p>").dialog({width: "500px", height: "400px", title: $(this).data("eventname") + " error details", buttons: { "Ok": function() { $(this).dialog("close"); } }, resizable: true }).css({height: "200px"});
			
		});
		$(".colorize").each(function() {
			var $el = $(this),
				pc, red = 255, 
				green = 255;
			//determine the type of content
			nrs = $el.text().split("/");
			if (nrs.length > 1) {
				pc = parseInt(nrs[0], 10) / parseInt(nrs[1], 10);
				
			} else {
				nrs = $el.text().split("%");
				pc = parseInt(nrs[0], 10) / 100;
			}
			if (pc > 0.5) {
				red = Math.floor((1 - pc) * red * 100) / 100;
				
			} else {
				green = Math.floor(pc * green * 100) / 100;
			}
			$el.css({"background-color": "rgb(" + red + "," + green + ",0)"});
		});
	});
</script>