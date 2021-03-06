bimp = {};

bimp.file = {
		inputFiles : [],
		xmlFile : "",
		initUpload : function() {
			$("#file-select").bind("change", FileSelectHandler);
			var filedrag = $("#file-drag");
			filedrag.bind("dragover", FileDragHover);
			filedrag.bind("dragleave", FileDragHover);
			filedrag.bind("drop", FileSelectHandler);
			filedrag.css({display:"block"});
		},
		parseFile : function (file) {
			//console.log("Parsing file: ", file);
			try {
				var reader = new FileReader();
				reader.readAsText(file);
				reader.onloadend = function (e) {
					try {
						bimp.file.readTextToDocument(e.target.result);
					} catch (e) {
						bimp.tools.openError("Invalid file!");
						console.log(e);
						throw new Error("Invalid file");
					}
				};
				
			} catch (e) {
				bimp.tools.openError("Invalid file!");
				console.log(e);
				throw new Error("Invalid file");
			}
		},
		readTextToDocument: function (text) {
			$("body").trigger(bimp.testutil.config.startEvent, ["readTextToDocument"]);
			bimp.file.xmlFile = $.parseXML(text);
			if ($(bimp.file.xmlFile)[0].documentElement.prefix) {
				bimp.parser.prefix = $(bimp.file.xmlFile)[0].documentElement.prefix + ":";
				bimp.parser.prefixEscaped = $(bimp.file.xmlFile)[0].documentElement.prefix + "\\:";
				bimp.parser.prefix = bimp.parser.prefix ? bimp.parser.prefix : "";
				// check if we need to use prefixEscaped for chrome or not
				if ($(bimp.file.xmlFile).find(bimp.parser.prefixEscaped + "startEvent").size() < $(bimp.file.xmlFile).find("startEvent").size()) {
					// if we need to use prefix (we get results) then use it, otherwise don't
					bimp.parser.prefixEscaped = "";
				}
				bimp.parser.prefixForDocumenation = (bimp.parser.prefixEscaped) ? bimp.parser.prefixEscaped:"";
			}
			//console.log("Parse success..");
			if($(bimp.file.xmlFile).find(bimp.parser.prefixEscaped + "startEvent").size() == 0) {
				throw new Error("No start event found!");
			}
			if (bimp.file.inputFiles[0]) {
				$("#fileName").text(bimp.file.inputFiles[0].name + " is selected.");
				$(".currentFileName").text(bimp.file.inputFiles[0].name);
			}
			$("#continue-button").attr("disabled", false);
			$("body").trigger(bimp.testutil.config.endEvent, ["readTextToDocument"]);
		},
		uploadFile : function () {
			$("body").trigger(bimp.testutil.config.startEvent, ["uploadFile"]);
			$.post("/uploadjson", {"mxmlLog": $("#mxmlLog").is(':checked'),"fileData": new XMLSerializer().serializeToString(bimp.parser.xmlFile)}, function (data) {
				if (data.status == "Success") {
					if (data.redirect) {
						$("body").trigger(bimp.testutil.config.endEvent, ["uploadFile"]);
						openLoadingModal();
					}
				} else {
					throw new Error ("Unable to upload file");
				}
			});
		},
		updateFile : function () {
			$("body").trigger(bimp.testutil.config.startEvent, ["updateFile"]);
			// check, if we have inputfile with siminfo
			if ($(bimp.parser.xmlFile).find(bimp.parser.prefixEscaped + "startEvent").find(bimp.parser.prefixEscaped + "documentation").size() == 0) {
				// lets add missing nodes to bpmn file
				var ns = bimp.parser.xmlFile.documentElement.getAttribute("xmlns");
				if (!ns) {
					ns = "";
				}
				var doc = "";
				try {
					doc = bimp.parser.xmlFile.createElementNS(ns, bimp.parser.prefix + "documentation");
				} catch (e) {
					if (console && console.log) {
						console.log("Unable to add documentation tags due to namespace issues, trying fallback..");
					}
					doc = bimp.parser.xmlFile.createElement(bimp.parser.prefix + "documentation");
				} 
				doc.setAttribute("id", generateId());
				var se = $(bimp.parser.xmlFile).find(bimp.parser.prefixEscaped + "startEvent")[0];
				se.appendChild(doc);
				$(bimp.parser.xmlFile).find(bimp.parser.prefixEscaped + "task").each(function (i, task) {
					try {
						doc = bimp.parser.xmlFile.createElementNS(ns, bimp.parser.prefix + "documentation");
					} catch (e) {
						if (console && console.log) {
							console.log("Unable to add documentation tags due to namespace issues, trying fallback..");
						}
						doc = bimp.parser.xmlFile.createElement(bimp.parser.prefix + "documentation");
					} 
					doc.setAttribute("id", generateId());
					task.appendChild(doc);
				});
				$(bimp.parser.xmlFile).find(bimp.parser.prefixEscaped + "intermediateCatchEvent").each(function (i, event) {
					try {
						doc = bimp.parser.xmlFile.createElementNS(ns, bimp.parser.prefix + "documentation");
					} catch (e) {
						if (console && console.log) {
							console.log("Unable to add documentation tags due to namespace issues, trying fallback..");
						}
						doc = bimp.parser.xmlFile.createElement(bimp.parser.prefix + "documentation");
					} 
					doc.setAttribute("id", generateId());
					event.appendChild(doc);
				});
				$.each(bimp.parser.conditionExpressions, function(id, element) {
					var conditionExpression = "";
					try {
						conditionExpression = bimp.parser.xmlFile.createElementNS(ns, bimp.parser.prefix + "conditionExpression");
					} catch (e) {
						if (console && console.log) {
							console.log("Unable to add documentation tags due to namespace issues, trying fallback..");
						}
						conditionExpression = bimp.parser.xmlFile.createElement(bimp.parser.prefix + "conditionExpression");
					} 
					conditionExpression.setAttribute("xsi:type", "tFormalExpression");
					conditionExpression.setAttribute("xmlns:xsi","http://www.w3.org/2001/XMLSchema-instance");
					var sf = $(bimp.parser.xmlFile).find("#" + id)[0];
					sf.appendChild(conditionExpression);
				});
			}
			
			// update startEvent
			var startEvents = $(bimp.parser.xmlFile).find(bimp.parser.prefixEscaped + "startEvent");
			if (startEvents.size() > 1) {
				for (var i = 0; i < startEvents.size(); i++) {
					if ($(startEvents[i]).find(bimp.parser.prefixForDocumenation + "documentation")[0]) {
						$(startEvents[i]).find(bimp.parser.prefixForDocumenation + "documentation")[0].textContent = JSON.stringify(bimp.parser.startEvent);
					}
				}
			} else {
				if (startEvents.find(bimp.parser.prefixForDocumenation + "documentation")[0]) {
					startEvents.find(bimp.parser.prefixForDocumenation + "documentation")[0].textContent = JSON.stringify(bimp.parser.startEvent);
				}
				
			}
			//console.log("Found startEvent and updated it");
		
			var taskNodes = $(bimp.parser.xmlFile).find(bimp.parser.prefixEscaped + "task");
			// tasks
			//handling empty subProcesses as tasks
			var subProcesses = $(bimp.parser.xmlFile).find(bimp.parser.prefixEscaped + "subProcess");
			for (var i = 0; i < subProcesses.length; i++) {
				if ($(subProcesses[i]).find(bimp.parser.prefixEscaped + "outgoing").length == 0) {
					taskNodes.push(subProcesses[i]);
				}
			}
			$.each(bimp.parser.tasks, function(id, task) {
				
				$(taskNodes).each(function(nodeId, taskNode) {
					if (taskNode.getAttribute("id") === id) {
						$(taskNode).find(bimp.parser.prefixForDocumenation + "documentation")[0].textContent = JSON.stringify(task);
						//console.log("Found task and updated it:", id);
					}
				});
			});
			// intermediate catch events
			var eventNodes = $(bimp.parser.xmlFile).find(bimp.parser.prefixEscaped + "intermediateCatchEvent");
			$.each(bimp.parser.intermediateCatchEvents, function(id, event) {
				$(eventNodes).each(function(nodeId, eventNode) {
					if (eventNode.getAttribute("id") === id) {
						$(eventNode).find(bimp.parser.prefixForDocumenation + "documentation")[0].textContent = JSON.stringify(event);
						//console.log("Found eventnode and updated it:", id);
					}
				});
			});
			// gateways
			var sequenceFlows = $(bimp.parser.xmlFile).find(bimp.parser.prefixEscaped + "sequenceFlow");
			$.each(bimp.parser.conditionExpressions, function(id, gateway) {
				$(sequenceFlows).each(function(nodeId, sequenceNode) {
					if (sequenceNode.getAttribute("id") === id) {
						$(sequenceNode).find(bimp.parser.prefixForDocumenation + "conditionExpression")[0].textContent = gateway.probability;
						//console.log("Found gateway and updated it:", id, gateway.probability);
					}
				});
			});
			$("body").trigger(bimp.testutil.config.endEvent, ["updateFile"]);
		}
		
};

function FileDragHover(e) {
	e.stopPropagation();
	e.preventDefault();
	e.target.className = (e.type == "dragover" ? "hover" : "");
}
function FileSelectHandler(e) {
	FileDragHover(e);
	//console.log(e.target);
	bimp.file.inputFiles = e.target.files || e.dataTransfer.files;

	for (var i = 0, f; f = bimp.file.inputFiles[i]; i++) {
		bimp.file.parseFile(f);
	}

}

$(document).ready(function() {
	jQuery.event.props.push("dataTransfer");
	bimp.file.initUpload();
});

function S4() {
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}
function generateId() {
   return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}
