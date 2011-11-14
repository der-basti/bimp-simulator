<%@ page language="java" contentType="text/html; charset=UTF8"
    pageEncoding="UTF8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

		<div id="resultsPage" class="contents gill-font">
			<button id="backToEditData" class="button">Back to edit data</button>	
			<div id="download-div">
				<form id="hiddenDownloadForm" method="post" action="/file">
					<input type="hidden" id="download" name="download" />
					Download .bpmn file with simulation information: <button id="downloadBpmn" class="button">Download</button><br/>
					</form>
					<!-- remove this after final ui-less sim implementation -->
					<form id="hiddenDownloadForm" method="post" action="/file">
						<input type="hidden" id="download" name="download" value="resultxml"/>
							Download .xml file of the results: <button id="downloadBpmn" class="button">Download</button><br/>
					</form>
					<!-- remove -->
					<c:if test="${enableLogDownload}">
						<form id="hiddenDownloadForm" method="post" action="/file">
						<input type="hidden" id="download" name="download" value="log"/>
							Download g-zipped .mxml log: <button id="downloadLog" class="button">Download</button>
						</form>
					</c:if> 
			<form method="post" action="/getCsv">
				Download simulation report: <input type="submit" class="button" value="Download">
			</form>
			</div>
			<div class="charts">
				<div id="duration-chart-div" class="chart"></div>
				<div id="waiting-time-chart-div" class="chart"></div>			
				<div id="cost-chart-div" class="chart"></div>	
				<div id="resources-chart-div" class="chart"></div>
			</div>
			<div id="results">
			<table>
			<tr>
				<td></td>
				<td><h3>Completed elements </h3> ${resultItem.completedElements } </td>
				<td><h3>Completed process instances </h3> ${resultItem.completedProcessInstances }</td>
			</tr>
			<tr>
				<td><h3>Minimum process cost </h3> <span class ="cost">${resultItem.minProcessCost}</span></td>
				<td><h3>Maximum process cost </h3> <span class ="cost">${resultItem.maxProcessCost }</span></td>
				<td><h3>Total cost </h3>  <span class ="cost">${resultItem.totalCost }</span></td>
				<td><h3>Average cost </h3>  <span class ="cost">${resultItem.totalCost / resultItem.completedProcessInstances }</span></td>
			</tr>
			<tr>
				<td><h3>Minimum process duration </h3> <span class ="duration">${resultItem.minProcessDuration }</span></td>
				<td><h3>Maximum process duration </h3> <span class ="duration">${resultItem.maxProcessDuration }</span></td>
				<td><h3>Total duration </h3>  <span class ="duration">${resultItem.totalDuration }</span></td>
				<td><h3>Average duration </h3>  <span class ="duration">${resultItem.totalDuration / resultItem.completedProcessInstances }</span></td>
			</tr>
			</table>
			</div>
			<div id="result-table">
			<table border="0">
				<tr>
					<th>Description</th>
					<th><span class ="costTitle">Average cost</span></th>
					<th><span class ="durationTitle">Average waiting time</span></th>
				</tr>
				<c:forEach var="element" items="${resultItem.activities}">
					<tr>
						<td>${element.description }</td>
						<td>${element.avgCost }</td>
						<td>${element.avgWaiting }</td>
					</tr>
				</c:forEach>
			</table>
			</div>
		</div>
		<script>
			var currency = bimp.parser.startEvent.currency;
			var durationIntervals;
			var durationCounts;
			var waitingTimeIntervals;
			var waitingTimeCounts;
			var costIntervals;
			var costCounts;
			var resources;
			var utilization;

			$(".costTitle").each(function () {
				$(this).text($(this).text() + " (" + currency + ")");
			});
			$(".durationTitle").each(function () {
				$(this).text($(this).text() + " (" + bimp.parser.startEvent.arrivalRateDistribution.timeUnit[0] + ")");
			});
			$(".cost").each(function () {
				$(this).text(Math.round($(this).text()*100)/100 + " " + currency);
			});
			$(".duration").each(function () {
				if ($(this).text() >= 432000) {
				    var value = convertSecondsToX($(this).text(), "days");
				    $(this).text(value + " days");
				}
				else if ($(this).text() >= 18000) {
				    var value = convertSecondsToX($(this).text(), "hours");
				    $(this).text(value + " h");
				}
				else if ($(this).text() >= 300) {
				    var value = convertSecondsToX($(this).text(), "minutes");
				    $(this).text(value + " min");
				}
				else {
				    var value = $(this).text();
				    $(this).text(value + " s");
				}
			});

			<c:if test="${not empty durationIntervals}">
			durationIntervals = ${durationIntervals};
			</c:if>
			<c:if test="${not empty durationCounts}">
			durationCounts = ${durationCounts};
			</c:if>
			<c:if test="${not empty waitingTimeIntervals}">
			waitingTimeIntervals = ${waitingTimeIntervals};
			</c:if>
			<c:if test="${not empty waitingTimeCounts}">
			waitingTimeCounts = ${waitingTimeCounts};
			</c:if>
			<c:if test="${not empty costIntervals}">
			costIntervals = ${costIntervals};
			</c:if>
			<c:if test="${not empty costCounts}">
			costCounts = ${costCounts};
			</c:if>
			<c:if test="${not empty resources}">
			resources = ${resources};
			</c:if>
			<c:if test="${not empty utilization}">
			utilization = ${utilization};
			</c:if>
			
			drawDurationsChart();
			drawWaitingTimesChart();
			drawCostsChart();
			drawResourcesChart();
		</script>
	
	
