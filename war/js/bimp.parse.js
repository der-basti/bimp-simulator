bimp.parser = {
	xmlFile : "",
	prefixEscaped : "",
	prefix : "",
	prefixForDocumenation : "",
	start : function () {
		this.init();
		this.readStartEvent();
		this.readTasks();
		this.readIntermediateCatchEvents();
		this.readConditionExpressions();
		//console.log("Finished reading data");
		bimp.forms.generate.start();
		updateAllTypeSelections();
		preloadTaskResources();
	},
	startEvent : {
		arrivalRateDistribution : {
			type : "",
			mean : "0",
			value : "0",
			stdev : "0",
			min : "0",
			max : "0",
			timeUnit : ""
		},
		instances : "",
		resources : {},
		startAt : "",
		timetable : {},
		currency : "",
		addResource : function(id, name, costPerHour, amount) {
			this.resources[id] = {
					"name" : name,
					"costPerHour" : costPerHour,
					"amount" : amount
			};
		},
		addTimetable : function(id, obj){
			timetable[id] = obj;
		}
	},
	tasks : {},
	task : function() {
		this.durationDistribution = {
			"type" : "",
			"mean" : "0",
			"value" : "0",
			"stdev" : "0",
			"min" : "0",
			"max" : "0",
			"timeUnit" : ""
		};
		this.resource = "";
		this.fixedCost = "0";
		this.name = "";
	},
	addTask : function (id, taskObj) {
		this.tasks[id] = $.extend(true, new bimp.parser.task(), taskObj);
		
	},
	hasIntermediatecatchEvents : false,
	intermediateCatchEvents : {},
	intermediateCatchEvent : function() {
		this.durationDistribution = {
			"type" : "",
			"mean" : "0",
			"value" : "0",
			"stdev" : "0",
			"min" : "0",
			"max" : "0",
			"timeUnit" : ""
		}
	},
	addIntermediateCatchEvent : function (id, catchEventObj){
		this.intermediateCatchEvents[id] =  $.extend(true, new bimp.parser.intermediateCatchEvent(), catchEventObj);
	},
	hasConditionExpressions: false,
	conditionExpressions : {},
	conditionExpression : function(id, targetRef, sourceRef, value, type, targetName, gatewayName) {
		this.id = id;
		this.targetRef = targetRef;
		this.sourceRef = sourceRef;
		this.probability = value;
		this.type = type;
		this.targetName = targetName;
		this.gatewayName = gatewayName;
	},
	init : function () {
		this.xmlFile = bimp.file.xmlFile;

	},
	readStartEvent : function() {
		$("body").trigger(bimp.testutil.config.startEvent, ["readStartEvent"]);
		var doc = $(this.xmlFile).find(bimp.parser.prefixEscaped + "startEvent").find(bimp.parser.prefixEscaped + "documentation");
		if (doc.length > 0) {
			//console.log("Found startEvent and added it");
			try {
				var simInfo = $.parseJSON(doc.text());
				$.extend(true, this.startEvent, simInfo);
			} catch (e) {
				if (console && console.log) {
					console.log("Documentation tag contains invalid JSON, ignoring it", e);
				}
			}
		} else {
			//console.log("No documentation info found for startEvent");
			// checking for resources defined with pools and lanes
			var resources = $(bimp.parser.xmlFile).find(bimp.parser.prefixEscaped + "lane");
			$(resources).each(function (index, resource) {
				var id = $(resource).attr("id");
				var name = $(resource).attr("name");
				$(bimp.parser.xmlFile).find("#" + id);
				bimp.parser.startEvent.addResource(id, name);
			});
		}
		$("body").trigger(bimp.testutil.config.endEvent, ["readStartEvent"]);
		return true;
	},
	readTasks : function() {
		$("body").trigger(bimp.testutil.config.startEvent, ["readTasks"]);
		var tasks = $(this.xmlFile).find(bimp.parser.prefixEscaped + "task");
		//console.log("Found",tasks.length,"tasks");
		$(tasks).each(function(index, task){
			var data = $(task).find(bimp.parser.prefixEscaped + "documentation");
			var taskObj = {};
			if (data.length > 0) {
				try {
					taskObj = $.parseJSON($(data).text());
				} catch (e) {
					if (console && console.log) {
						console.log("Documentation tag contains invalid JSON, ignoring it", e)
					}
				}
			}
			var id = task.getAttribute("id");
			var name = {
					name : task.getAttribute("name")
			};
			$.extend(true, taskObj, name);
			bimp.parser.addTask(id, taskObj);
			//console.log("Added task", name," with id =", id);
		});
		$("body").trigger(bimp.testutil.config.endEvent, ["readTasks"]);
		return true;
	},
	readIntermediateCatchEvents : function() {
		$("body").trigger(bimp.testutil.config.startEvent, ["readIntermediateCatchEvents"]);
		var events = $(this.xmlFile).find(bimp.parser.prefixEscaped + "intermediateCatchEvent");
		//console.log("Found", events.length, "intermediateCatchEvents");
		$(events).each(function(index, event){
			bimp.parser.hasIntermediatecatchEvents = true;
			var data = $(event).find(bimp.parser.prefixEscaped + "documentation");
			var catchEventObj = {};
			if (data.length > 0) {
				try {
					catchEventObj = $.parseJSON($(data).text());
				} catch (e) {
					if (console && console.log) {
						console.log("Documentation tag contains invalid JSON, ignoring it", e)
					}
				}
			}
			var id = event.getAttribute("id");
			var name = {
					name : event.getAttribute("name")
			};
			$.extend(true, catchEventObj, name);
			bimp.parser.addIntermediateCatchEvent(id, catchEventObj);
			//console.log("Added catchEvent with id =", id);
		});

		$("body").trigger(bimp.testutil.config.endEvent, ["readIntermediateCatchEvents"]);
		return true;
	},
	readConditionExpressions : function() {
		$("body").trigger(bimp.testutil.config.startEvent, ["readConditionExpressions"]);
		sequenceFlows = $(this.xmlFile).find(bimp.parser.prefixEscaped + "sequenceFlow");
		// finds sequenceflows where sourceRef is XOR or OR split gateway 
		// gatewayDirection="diverging" or gatewayDirection="mixed";
		// XOR = exclusiveGateway, sum for XORs have to be 100%
		// OR = inclusiveGateway, are independent
		$(sequenceFlows).each(function(index, sequenceFlow){
			var sourceRef = sequenceFlow.getAttribute("sourceRef");
			var type = bimp.parser.findSplitGateway(sourceRef);
			if (type !== null) {
				var conditionExpression = $(sequenceFlow).find(bimp.parser.prefixEscaped + "conditionExpression");
				var value = "";
				if (conditionExpression.length > 0) {
					value = Number(conditionExpression[0].textContent) ? conditionExpression[0].textContent : 0;
				}
				//console.log("Found conditionExpression and added it");
				var targetRef = sequenceFlow.getAttribute("targetRef");
				var targetName = $(bimp.parser.xmlFile).find("#" + targetRef)[0].getAttribute("name");
				if (value === "" && type === "Inclusive (OR)") {
					// defaulting to 100%
					value = 1;
				}
				var id = sequenceFlow.getAttribute("id");
				var gatewayName = sequenceFlow.getAttribute("name");
				ce = new bimp.parser.conditionExpression(id, targetRef, sourceRef, value,
						type, targetName ? (targetName.trim != "" ? targetName : "N/A") : "N/A", gatewayName);
				bimp.parser.hasConditionExpressions = true;
				bimp.parser.conditionExpressions[id] = ce;
			}
		});
		$("body").trigger(bimp.testutil.config.endEvent, ["readConditionExpressions"]);
		return true;
	},
	findSplitGateway : function(id) {
		var result = null;
		var exclusiveGateways = $(this.xmlFile).find(bimp.parser.prefixEscaped + "exclusiveGateway");
		var inclusiveGateways = $(this.xmlFile).find(bimp.parser.prefixEscaped + "inclusiveGateway");
		$(exclusiveGateways).each(function(index, exclusiveGateway) {
			if (exclusiveGateway.getAttribute("id") == id && 
					(exclusiveGateway.getAttribute("gatewayDirection") == "diverging" ||
					exclusiveGateway.getAttribute("gatewayDirection") == "mixed") ||
					bimp.parser.countSequenceFlowsFromGateway(id) > 1) {
				result = "Exclusive (XOR)";
			}
		});
		$(inclusiveGateways).each(function(index, inclusiveGateway) {
			if (inclusiveGateway.getAttribute("id") == id && 
					(inclusiveGateway.getAttribute("gatewayDirection") == "diverging" ||
					inclusiveGateway.getAttribute("gatewayDirection") == "mixed") ||
					bimp.parser.countSequenceFlowsFromGateway(id) > 1) {
				result = "Inclusive (OR)";
			}
		});
		return result;
	},
	countSequenceFlowsFromGateway : function (id) {
		var count = 0;
		sequenceFlows = $(this.xmlFile).find(bimp.parser.prefixEscaped + "sequenceFlow");
		// TODO: Refactor it, currently too slow
		$(sequenceFlows).each(function(index, sequenceFlow) {
			var sourceRef = sequenceFlow.getAttribute("sourceRef");
			var sourceRefNodeName = "";
			if ($(bimp.parser.xmlFile).find("#" + sourceRef)[0]) {
				sourceRefNodeName = $(bimp.parser.xmlFile).find("#" + sourceRef)[0].nodeName;
			}
			if (sourceRefNodeName == bimp.parser.prefix + "exclusiveGateway" || sourceRefNodeName == bimp.parser.prefix + "inclusiveGateway") {
				if (sourceRef === id) {
					count += 1;
				}
			}
		});
		return count;
	}
};