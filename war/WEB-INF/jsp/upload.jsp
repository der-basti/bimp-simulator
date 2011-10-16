<%@ page language="java" contentType="text/html; charset=UTF8"
	pageEncoding="UTF8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF8">
<script type="text/javascript" src="./js/jquery-1.6.4.min.js"></script>
<script type="text/javascript" src="./js/jquery-ui-1.8.16.custom.min.js"></script>
<script type="text/javascript" src="./js/bimp.file.js"></script>
<script type="text/javascript" src="./js/bimp.parse.js"></script>
<script type="text/javascript" src="./js/bimp.forms.js"></script>
<script type="text/javascript" src="./js/javascript.js"></script>

<link rel="stylesheet" type="text/css" href="./css/style.css"></link>
<link rel="stylesheet" type="text/css" href="./css/jquery-ui-1.8.16.custom.css"></link>
<link href='http://fonts.googleapis.com/css?family=Open+Sans:300' rel='stylesheet' type='text/css'>
<title>BIMP Simulator</title>
</head>
<body>
	<div id="main">
		<jsp:include page="_header.jsp"></jsp:include>
		<div id="contents">
			<div id="upload-area">
				<form id="upload" modelAttribute="uploadItem" action="/uploadfile"
					method="POST" enctype="multipart/form-data">

					<fieldset>
						<legend>Upload your .BPMN file</legend>

						<input type="hidden" id="MAX_FILE_SIZE" name="MAX_FILE_SIZE"
							value="300000" />

						<div>
							<label for="file-select">Select the file:</label> <input
								type="file" id="file-select" name="fileData" />
							<div id="file-drag">or drop it here</div>
						</div>
					<span id="fileName">No file selected.</span>
					</fieldset>
				</form>
				<button class="button" id="continue-button">Continue</button>				
			</div>
			<div id="submit-button">
				<button id="startSimulationButton">Start Simulation</button>
			</div>
			<div id="data-input" class="gill-font">
				<form action="">
					<div class="startEvent">
						<h2>Main start event</h2>
						<table class="form">
							<tbody>
								<tr>
									<th>Name:</th>
									<td><span class="name">Event's Name</span>
									</td>
								</tr>
								<tr id="arrivalRateDistribution">
									<th>Arrival rate:</th>
									<td><select class="type" name="type">
											<option value="fixed">Fixed</option>
											<option value="standard">Standard</option>
											<option value="exponential">Exponential</option>
											<option value="uniform">Uniform</option>
										</select>
										<div> Value: <input class="small value" name="value" type="text"></div>
										<div> Mean: <input class="small mean" name="mean" type="text"></div>
										<div> Standard deviation: <input class="small stdev" name="stdev" type="text"></div>
										<div> Min: <input class="small min" name="min" type="text"></div>
										<div> Max: <input class="small max" name="max" type="text"></div>
									</td>
								</tr>
								<tr>
									<th># of instances</th>
									<td><input class="instances" name="instances"
										class="small" type="text">
									</td>
								</tr>
								<tr>
									<th>Simulation start time</th>
									<td>
										<!-- TODO: date and time input, 
										get rid of script, 
										normal handler for starttime onFocus --> <input name="startAt"
										class="normal datepicker startAtDate" type="text"
										onFocus="if(this.value==this.defaultValue){this.value='';}"
										value="yyyy-mm-dd"> 
										
										<input name="startAt"
										class="normal timepicker startAtTime" type="text"
										onFocus="if(this.value==this.defaultValue){this.value='';}"
										value="HH:MM:SS">
										<script>
											$(".datepicker").datepicker({
												dateFormat : 'yy-mm-dd'
											});
										</script></td>
								</tr>
							</tbody>
						</table>
					</div>
					<hr />
					<div class="resources">
						<h2>Resources</h2>
						<table>
							<tbody>
								<tr>
									<td><a class="trigger add" href="javascript:void(0)">Add</a></td>
									<th>Name</th>
									<th>Cost per hour</th>
									<th>Amount</th>
								<tr>
								<tr class="resource">
									<td></td>
									<td><input class="normal name" name="name" type="text"></td>
									<td><input class="small costPerHour" name="costPerHour" type="text"></td>
									<td><input class="small text amount" name="amount" type="text"></td>
									<td><a class="trigger remove" href="javascript:void(0)" title="Remove field">X</a></td>
								</tr>
							</tbody>
						</table>
					</div>
					<hr />
					<div class="timetables">
						<h2>Timetable</h2>
						<table>
							<tbody>
								<tr>
									<td><a class="trigger add" href="javascript:void(0)" title="Add new field">Add</a></td>
									<th>Resource</th>
									<th>Begin day</th>
									<th>End day</th>
									<th>Begin time</th>
									<th>End time</th>

								</tr>
								<tr class="timetable">
										<td></td>
										<td>
											<select class="resource" name="resource">
													<option value="*">*</option>
											</select>
										</td>
										<td>
											<select class="startday" name="startday">
												<option value="Mon">Monday</option>
												<option value="Tue">Tuesday</option>
												<option value="Wed">Wednesday</option>
												<option value="Thu">Thursday</option>
												<option value="Fri">Friday</option>
												<option value="Sat">Saturday</option>
												<option value="Sun">Sunday</option>
											</select>
										</td>
										<td>
											<select class="endday" name="endday">
												<option value="Mon">Monday</option>
												<option value="Tue">Tuesday</option>
												<option value="Wed">Wednesday</option>
												<option value="Thu">Thursday</option>
												<option value="Fri">Friday</option>
												<option value="Sat">Saturday</option>
												<option value="Sun">Sunday</option>
											</select>
										</td>
										<td>
											<input class="begintime" name="begintime" class="timepicker">
										</td>
										<td>
											<input class="endtime" name="endtime" class="timepicker">
										</td>
										<td><a class="trigger remove" href="javascript:void(0)" title="Remove field">X</a></td>
								</tr>
								<tr>

								</tr>

							</tbody>
						</table>
					</div>
					<hr />
					<div class="tasks">
						<h2>Task</h2>
						<div class="task">
							<table>
								<tbody>
									<tr>
										<th>Name:</th>
										<td><span class="name">Task name</span></td>
									</tr>
									<tr class="hidden">
										<th>Task id:</th>
										<td><span class="id">id</span></td>
									</tr>
									<tr>
										<th>Resource:</th>
										<td><select class="resource" name="resource">
										</select>
										</td>
									</tr>
									<tr>
										<th>Fixed cost:</th>
										<td><input class="fixedCost" name="fixedCost" /></td>
									</tr>
									<tr>
										<th>Type</th>
										<td><select class="type" name="type">
												<option value="fixed">Fixed</option>
												<option value="standard">Standard</option>
												<option value="exponential">Exponential</option>
												<option value="uniform">Uniform</option>
											</select>
											<div> Value: <input class="small value" name="value" type="text"></div>
											<div> Mean: <input class="small mean" name="mean" type="text"></div>
											<div> Standard deviation: <input class="small stdev" name="stdev" type="text"></div>
											<div> Min: <input class="small min" name="min" type="text"></div>
											<div> Max: <input class="small max" name="max" type="text"></div>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
					<hr />
					<div class="gateways">
						<h2>Gateways</h2>

						<div class="gateway">
							<table>
								<tbody>
									<tr>
										<th>Type:</th>
										<td><span class="type">Type</span></td>
									</tr>
									<tr>
										<th>Target name:</th>
										<td><span class="targetName">N/A</span></td>
									</tr>
									<tr class="hidden">
										<th>Id:</th>
										<td><span class="id">id</span></td>
									</tr>
									<tr class="hidden">
										<th>SourceRef</th>
										<td><span class="sourceRef">SourceRef</span></td>
									</tr>
									<tr class="hidden">
										<th>TargetRef</th>
										<td><span class="targetRef">TargetRef</span></td>
									</tr>
									<tr>
										<th>Probability of execution:</th>
										<td><input class="small probability" name="probability" /><label
											for="probability">%</label></td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
					<hr />
					<div class="catchEvents">
						<h2>Intermediate events</h2>
						<div class="catchEvent">
							<table>
								<tbody>
									<tr>
										<th>Name:</th>
										<td><span class="name">Event name</span>
										<td>
									</tr>
									<tr>
										<th>Type:</th>
										<td><select class="type" name="type">
												<option value="fixed">Fixed</option>
												<option value="standard">Standard</option>
												<option value="exponential">Exponential</option>
												<option value="uniform">Uniform</option>

											</select>
											<div> Value: <input class="small value" name="value" type="text"></div>
											<div> Mean: <input class="small mean" name="mean" type="text"></div>
											<div> Standard deviation: <input class="small stdev" name="stdev" type="text"></div>
											<div> Min: <input class="small min" name="min" type="text"></div>
											<div> Max: <input class="small max" name="max" type="text"></div>
										</td>
									<tr>
								</tbody>
							</table>
						</div>
					</div>

				</form>
			</div>
			<br>
			<div id="file-info"></div>
		</div>
		<jsp:include page="_footer.jsp"></jsp:include>
	</div>
</body>
</html>