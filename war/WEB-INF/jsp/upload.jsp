<%@ page language="java" contentType="text/html; charset=UTF8"
	pageEncoding="UTF8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF8">
		<script type="text/javascript" src="./js/jquery-1.6.4.min.js"></script>
		<script type="text/javascript" src="./js/bimp.file.js"></script>
		<script type="text/javascript" src="./js/bimp.parse.js"></script>
		
		<link rel="stylesheet" type="text/css"  href="./css/style.css"></link>
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
										<input class="small" type="text">
									</td>
								</tr>
								<tr>
									<th>Simulation start time</th>
									<td>
										<input class="normal" type="text">
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
								<tr>
									<td><button name="add">Add new field</button> <button name="clear">Clear</button></td>
								</tr>
							</tbody>
						</table>
					</div>
				</form>
			</div>
			<div id="file-info">
			</div>
	</body>
</html>