<input type="hidden" id="signavioFile" value='${xmlFile}'/>
<script type="text/javascript">
	$(document).ready(function () {
		var signavioXmlFile = $("#signavioFile").val();
		var referer = "${referer}";
		try {
			console.log("loading model provided by signavio");
			bimp.file.readTextToDocument(signavioXmlFile);
			try {
				console.log("starting parser");
				bimp.parser.start();
				console.log("showing form");
				showForm(0);
			} catch (e) {
				console.log(e);
				alert("invalid model");
				document.location = referer;
			}
		} catch (e) {
			console.log(e);
			alert("invalid file");
			document.location = referer;
		}
	});
</script>