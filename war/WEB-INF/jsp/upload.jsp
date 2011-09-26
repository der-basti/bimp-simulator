<%@ page language="java" contentType="text/html; charset=UTF8"
	pageEncoding="UTF8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF8">
		<script type="text/javascript" src="./js/jquery-1.6.4.min.js"></script>
		<script type="text/javascript" src="./js/bimp.file.js"></script>
		<link rel="stylesheet" type="text/css"  href="./css/style.css"></link>
		<title>BIMP Simulator</title>
	</head>
	<body>
		${msg}
		${file.originalFilename}
		<div class="upload-area">
			<form id="upload" modelAttribute="uploadItem" action="/uploadfile" method="POST" enctype="multipart/form-data">
	
				<fieldset>
					<legend>Upload your .BPMN file</legend>
	
					<input type="hidden" id="MAX_FILE_SIZE" name="MAX_FILE_SIZE"
						value="300000" />
	
					<div>
						<label for="file-select">Select the file:</label> <input type="file"
							id="file-select" name="fileData" />
						<div id="file-drag">or drop it here</div>
					</div>
	
					<div id="submit-button">
						<button type="submit">Upload File</button>
					</div>
	
				</fieldset>
	
			</form>
	
			<div id="progress"></div>
	
			<div id="file-info">
			</div>
		</div>
		${enabledElements} <br />
		Minimum process cost: ${minProcessCost} <br />
		Maximum process cost: ${maxProcessCost} <br />
		Minimum process duration: ${minProcessDuration} <br />
		Maximum process duration: ${maxProcessDuration} <br />
	</body>
</html>