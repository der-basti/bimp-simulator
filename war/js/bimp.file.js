bimp = {};

bimp.file = {
		inputFiles : [],
		xmlFile : "",
		simulationInfoTag : "documentation",
		initUpload : function() {
			$("#file-select").bind("change", FileSelectHandler);
			var xhr = new XMLHttpRequest();
			if (xhr.upload) {
				var filedrag = $("#file-drag");
				filedrag.bind("dragover", FileDragHover);
				filedrag.bind("dragleave", FileDragHover);
				filedrag.bind("drop", FileSelectHandler);
				filedrag.css({display:"block"});
			}
		},
		getFileExtension : function (file) {
			var splittedName = file.fileName.split(".");
			return splittedName[splittedName.length - 1];
		},
		parseFile : function (file) {
			console.log("Parsing file: ", file);
			try {
				var reader = new FileReader();
				reader.readAsText(this.inputFiles[0]);
				reader.onloadend = function (e) {
					bimp.file.xmlFile = $.parseXML(e.target.result);
					console.log("Parse success..");
					var doc = $(bimp.file.xmlFile).find("documentation");
					if (doc.length > 0) {
						console.log("File with simulation information provided");
					} else {
						console.log("File with no simulation information provided");
					}
					bimp.parser.init();
					bimp.parser.start();
				};
				
			} catch (e) {
				alert("Error parsing .xml document", e);
				console.log(e);
			}
			
			if (bimp.file.getFileExtension(file) == "bpmn") {
				var reader = new FileReader();
				reader.onload = function(e) {
					bimp.file.outputFileInfo(
							"<p>File information: <strong>" + file.name +
							"</strong> type: <strong>" + file.type +
							"</strong> size: <strong>" + file.size +
							"</strong> bytes</p>" + "<pre>" +
						e.target.result.replace(/</g, "&lt;").replace(/>/g, "&gt;") +
						"</pre>"
					);
				};
				reader.readAsText(file);
			}

		},
		outputFileInfo : function (msg) {
			$("#file-info").html(msg);
		},
		uploadFile : function (file) {
			console.log("upload");

			var xhr = new XMLHttpRequest();
			console.log("fileType:", file.type);
			
			//TODO: $.ajax'i peale ehk??
			if (xhr.upload && bimp.file.getFileExtension(file) == "bpmn" && file.size <= $("#MAX_FILE_SIZE").attr("value")) {
				// create progress bar
				var o = $("#progress");
				var progress = o.append(document.createElement("p"));
				progress.append(document.createTextNode("upload " + file.name));

				// progress bar
				xhr.upload.addEventListener("progress", function(e) {
					var pc = parseInt(100 - (e.loaded / e.total * 100));
					progress.style.backgroundPosition = pc + "% 0";
				}, false);

				// file received/failed
				xhr.onreadystatechange = function(e) {
					if (xhr.readyState == 4) {
						progress.className = (xhr.status == 200 ? "success" : "failure");
					}
				};

				// start upload
				xhr.open("POST", document.getElementById("upload").action, true);
				xhr.setRequestHeader("X_FILENAME", file.name);
				xhr.send(file);
			} else {
				alert("Not .bpmn or too large file");
			}

		}
};

function FileDragHover(e) {
	e.stopPropagation();
	e.preventDefault();
	e.target.className = (e.type == "dragover" ? "hover" : "");
}
var aaa;
function FileSelectHandler(e) {
	FileDragHover(e);
	aaa= e.target
	console.log(e.target)
	bimp.file.inputFiles = e.target.files || e.dataTransfer.files;

	for (var i = 0, f; f = bimp.file.inputFiles[i]; i++) {
		bimp.file.parseFile(f);
		
		//TODO: Uploading backend
		//bimp.file.uploadFile(f);
	}

}

$(document).ready(function() {
	jQuery.event.props.push("dataTransfer");
	bimp.file.initUpload();
});
