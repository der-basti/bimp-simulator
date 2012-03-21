<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<input type="hidden" id="testFile" value='<c:out value="${testFile}" escapeXml="true"/>'/>
<input type="hidden" id="fileNr" value="${fileNr}"/>
<input type="hidden" id="fileName" value="${fileName}"/>
<input type="hidden" id="filesTotal" value="${filesTotal}"/>

<script type="text/javascript">
	$(document).ready(function () {
		bimp.testutil.init();
	});
</script>