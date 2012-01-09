<script type="text/javascript">
	$(document).ready(function () {
		var signavioXmlFile = ${xmlFile};
		var referer = ${referer};
		try {
			bimp.file.parseFile(signavioXmlFile);
			try {
				showForm(0);
			} catch (e) {
				console.log(e);
				alert("invalid model");
				document.location(referer);
			}
		} catch (e) {
			console.log(e);
			alert("invalid file");
			document.location(referer);
		}
	});
</script>