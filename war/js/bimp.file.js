bimp = {};

bimp.file = {
		inputFiles : [],
		xmlFile : "",
		simulationInfoTag : "documentation",
		initUpload : function() {
			$("#file-select").bind("change", FileSelectHandler);
			var filedrag = $("#file-drag");
			filedrag.bind("dragover", FileDragHover);
			filedrag.bind("dragleave", FileDragHover);
			filedrag.bind("drop", FileSelectHandler);
			filedrag.css({display:"block"});
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
					try {
						bimp.file.xmlFile = $.parseXML(e.target.result);
						console.log("Parse success..");
						var doc = $(bimp.file.xmlFile).find("documentation");
						if (doc.length > 0) {
							console.log("File with simulation information provided");
						} else {
							console.log("File with no simulation information provided");
						}
						$("#startSimulationButton").show(300);
						$(".data-input").show(500);
						bimp.parser.init();
						bimp.parser.start();
					} catch (e) {
						alert("Error parsing file, please provide valid file.");
						console.log(e);
					}
				};
				
			} catch (e) {
				alert("Error reading filem please provide valid file.", e);
				console.log(e);
			}
			
			/*if (bimp.file.getFileExtension(file) == "bpmn") {
				var reader = new FileReader();
				reader.onload = function(e) {
					/*bimp.file.outputFileInfo(
							"<p>File information: <strong>" + file.name +
							"</strong> type: <strong>" + file.type +
							"</strong> size: <strong>" + file.size +
							"</strong> bytes</p>" + "<pre>" +
						e.target.result.replace(/</g, "&lt;").replace(/>/g, "&gt;") +
						"</pre>"
					);
				};
				reader.readAsText(file);
			}*/

		},
		outputFileInfo : function (msg) {
			$("#file-info").html(msg);
		},
		uploadFile : function () {
			$.post("/uploadjson", {"fileData": new XMLSerializer().serializeToString(bimp.parser.xmlFile)}, function (data) {
				console.log(data);
				if (data.status == "Success") {
					console.log("file upload successful");
					if (data.redirect) {
						window.location = data.redirect;
					}
				}
			});
		},
		updateFile : function () {
			// check, if we have inputfile with siminfo
			if ($(bimp.parser.xmlFile).find("startEvent").find("documentation").size() == 0) {
				// lets add missing nodes to bpmn file
				var doc = bimp.parser.xmlFile.createElement("documentation");
				var se = $(bimp.parser.xmlFile).find("startEvent")[0];
				se.appendChild(doc);
				$(bimp.parser.xmlFile).find("task").each(function (i, task) {
					var doc = bimp.parser.xmlFile.createElement("documentation");
					task.appendChild(doc);
				});
				$(bimp.parser.xmlFile).find("intermediateCatchEvent").each(function (i, event) {
					var doc = bimp.parser.xmlFile.createElement("documentation");
					event.appendChild(doc);
				});
				$.each(bimp.parser.conditionExpressions, function(id, element) {
					var conditionExpression = bimp.parser.xmlFile.createElement("conditionExpression");
					conditionExpression.setAttribute("xsi:type", "tFormalExpression");
					conditionExpression.setAttribute("xmlns:xsi","http://www.w3.org/2001/XMLSchema-instance");
					
					element.appendChild(conditionExpression);
				});
			}
			// update startEvent
			$(bimp.parser.xmlFile).find("startEvent").find("documentation")[0].textContent = JSON.stringify(bimp.parser.startEvent);
			console.log("Found startEvent and updated it");
		
			var taskNodes = $(bimp.parser.xmlFile).find("task");
			// tasks
			$.each(bimp.parser.tasks, function(id, task) {
				
				$(taskNodes).each(function(nodeId, taskNode) {
					if (taskNode.getAttribute("id") === id) {
						$(taskNode).find("documentation")[0].textContent = JSON.stringify(task);
						console.log("Found task and updated it:", id);
					}
				});
			});
			// intermediate catch events
			var eventNodes = $(bimp.parser.xmlFile).find("intermediateCatchEvent");
			$.each(bimp.parser.intermediateCatchEvents, function(id, event) {
				$(eventNodes).each(function(nodeId, eventNode) {
					if (eventNode.getAttribute("id") === id) {
						$(eventNode).find("documentation")[0].textContent = JSON.stringify(event);
						console.log("Found eventnode and updated it:", id);
					}
				});
			});
			// gateways
			var sequenceFlows = $(bimp.parser.xmlFile).find("sequenceFlow");
			$.each(bimp.parser.conditionExpressions, function(id, gateway) {
				$(sequenceFlows).each(function(nodeId, sequenceNode) {
					if (sequenceNode.getAttribute("id") === id) {
						$(sequenceNode).find("conditionExpression")[0].textContent = gateway.probability;
						console.log("Found gateway and updated it:", id, gateway.probability);
					}
				});
			});
		},
		
};

function FileDragHover(e) {
	e.stopPropagation();
	e.preventDefault();
	e.target.className = (e.type == "dragover" ? "hover" : "");
}
function FileSelectHandler(e) {
	FileDragHover(e);
	console.log(e.target);
	bimp.file.inputFiles = e.target.files || e.dataTransfer.files;

	for (var i = 0, f; f = bimp.file.inputFiles[i]; i++) {
		bimp.file.parseFile(f);
	}

}

$(document).ready(function() {
	jQuery.event.props.push("dataTransfer");
	bimp.file.initUpload();
});