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
		
		<link rel="stylesheet" type="text/css"  href="./css/style.css"></link>
		<link rel="stylesheet" type="text/css"  href="./css/jquery-ui-1.8.16.custom.css"></link>
		<title>BIMP Simulator</title>
	</head>
		<body>
		${msg} ${file.originalFilename}
		<div class="upload-area">
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
	
					<div id="submit-button">
						<button type="submit">Upload File</button>
					</div>
	
				</fieldset>
	
			</form>
			<div id="progress"></div>
		</div>
			<div class="data-input">
				<form action="">
					<div class="startEvent">
						<h2>Main start event</h2>
						<table class="form">
							<tbody>
								<tr id="name">
									<th>Name: </th>
									<td>
										<select name="name">
											<option value="generate">Will be generated from file</option>
										</select>
									</td>
								</tr>
								<tr id="arrivalRateDistribution">
									<th>Arrival rate: </th>
									<td>
										<select name="type">
											<option value="fixed">Fixed</option>
											<option value="standard">Standard</option>
											<option value="exponential">Exponential</option>
											<option value="uniform">Uniform</option>
										</select>
										<div class="value"> Value: <input class="small" name="value" type="text"></div>
										<div class="mean"> Mean: <input class="small" name="mean" type="text"></div>
										<div class="standardDeviation">  Standard deviation: <input class="small" type="text"></div>
										<div class="min"> Min: <input class="small" type="text"></div>
										<div class="max"> Max: <input class="small" type="text"></div>
									</td>
								</tr>
								<tr>
									<th># of instances</th>
									<td>
										<input id="instances" name="instances" class="small" type="text">
									</td>
								</tr>
								<tr>
									<th>Simulation start time</th>
									<td>
										<!-- TODO: date and time input, 
										get rid of script, 
										normal handler for starttime onFocus -->
										<input id="starttime" name="starttime" class="normal datepicker" type="text" onFocus="if(this.value==this.defaultValue){this.value='';}" value="yyyy-mm-dd hh:mm:ss">
										<script>$(".datepicker").datepicker({ dateFormat: 'yy-mm-dd' });</script>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="resources">
						<h2>Resources</h2>
						<table>
							<tbody>
								<tr>
									<th>Name</th>
									<th>Cost per hour</th>
									<th>Amount</th>
								<tr>
								<tr class="resource">
									<td><input class="normal" type="text"></td>
									<td><input class="small" type="text"></td>
									<td><input class="small" type="text"></td>
								</tr>
								<tr class="add-remove">
									<td><a class="trigger" href="#">Add</a><a class="trigger" href="#">Clear</a></td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="timetable">
						<h2>Timetable</h2>
						<table>
							<tbody>
								<tr>
									<th></th>
									<th>Resource</th>
									<th>Begin day</th>
									<th>End day</th>
									<th>Begin time</th>
									<th>End time</th>
								</tr>
								<tr>
										<td><a class="trigger add" href="#" title="Add new field">+</a></td>
										<td>
											<select name="resource">
													<option value="*">*</option>
													<option value="Resource1">Resource1</option>
											</select>
										</td>
										<td>
											<select id="startday" name="startday">
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
											<select id="endday" name="endday">
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
											<input id="begintime" name="begintime" class="timepicker">
										</td>
										<td>
											<input id="endtime" name="endtime" class="timepicker">
										</td>
										<td><a class="trigger remove" href="#" title="Remove field">X</a></td>
								</tr>
								<tr>
									
								</tr>
								
							</tbody>
						</table>
					</div>
					<div class="task">
						<h2>Task</h2>
						
						<table>
							<tbody>
								<tr>
									<th>Name:</th>
									<td>Task name</td>
								</tr>
								<tr>
									<th>Task id:</th>
									<td>12312312</td>
								</tr>
								<tr>
									<th>Resource:</th>
									<td> 
										<select name="resource">
											<option value="*">*</option>
											<option value="Resource1">Resource1</option>
										</select>
									</td>
								</tr>
								<tr>
									<th>Type</th>
									<td>
										<select name="type">
											<option value="fixed">Fixed</option>
											<option value="standard">Standard</option>
											<option value="exponential">Exponential</option>
											<option value="uniform">Uniform</option>
										</select>
										<div class="value"> Value: <input class="small" name="value" type="text"></div>
										<div class="mean"> Mean: <input class="small" name="mean" type="text"></div>
										<div class="standardDeviation">  Standard deviation: <input class="small" type="text"></div>
										<div class="min"> Min: <input class="small" type="text"></div>
										<div class="max"> Max: <input class="small" type="text"></div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="gateways">
						<h2>Gateways</h2>
						
						<div class="gateway">
							<table>
								<tbody>
									<tr>
										<th>Name:</th>
										<td>Gateway name/target name?</td>
									</tr>
									<tr>
										<th>Probability of execution:</th>
										<td><input class="small" id="probability" name="probability"/><label for="probability">%</label></td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
					<div class="catchEvents">
						<h2>Intermediate events</h2>
						<div class="catchEvent">
							<table>
								<tbody>
									<tr>
										<th>Name:</th>
										<td>Event name<td>
									</tr>
									<tr>
										<th>Type</th>
										<td>
											<select name="type">
												<option value="fixed">Fixed</option>
												<option value="standard">Standard</option>
												<option value="exponential">Exponential</option>
												<option value="uniform">Uniform</option>
											</select>
											<div class="value"> Value: <input class="small" name="value" type="text"></div>
											<div class="mean"> Mean: <input class="small" name="mean" type="text"></div>
											<div class="standardDeviation">  Standard deviation: <input class="small" type="text"></div>
											<div class="min"> Min: <input class="small" type="text"></div>
											<div class="max"> Max: <input class="small" type="text"></div>
										</td>
									<tr>
								</tbody>
							</table>
						</div>
					</div>
					
				</form>
			</div>
			<div id="file-info">
			</div>
	</body>
</html>