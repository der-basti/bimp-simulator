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
				<h3>Completed elements </h3> ${resultItem.completedElements }
				<h3>Completed process instances </h3> ${resultItem.completedProcessInstances }
				<h3>Maximum process cost </h3> ${resultItem.maxProcessCost }
				<h3>Maximum process duration </h3> ${resultItem.maxProcessDuration }
				<h3>Minimum process cost </h3> ${resultItem.minProcessCost}
				<h3>Minimum process duration </h3>${resultItem.minProcessDuration }
				<h3>Total cost </h3> ${resultItem.totalCost }
				<h3>Total duration </h3>${resultItem.totalDuration }
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
				<c:forEach var="element" items="${resultItem.activities}">
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
		<script>
			var durationIntervals;
			var durationCounts
			var waitingTimeIntervals;
			var waitingTimeCounts;
			var costIntervals;
			var costCounts;
			var resources;
			var utilization;
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
	
	
