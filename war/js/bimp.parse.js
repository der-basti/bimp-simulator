bimp.parser = {
	xmlFile : "",
	prefixEscaped : "",
	prefix : "",
	start : function () {
		this.readStartEvent();
		this.readTasks();
		this.readIntermediateCatchEvents();
		this.readConditionExpressions();
		//console.log("Finished reading data");
		bimp.forms.generate.start();
		updateAllTypeSelections();
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
	conditionExpression : function(id, targetRef, sourceRef, value, type, targetName) {
		this.id = id;
		this.targetRef = targetRef;
		this.sourceRef = sourceRef;
		this.probability = value;
		this.type = type;
		this.targetName = targetName;
	},
	init : function () {
		this.xmlFile = bimp.file.xmlFile;
		if ($(bimp.parser.xmlFile)[0].documentElement.prefix) {
			this.prefix = $(bimp.parser.xmlFile)[0].documentElement.prefix + ":";
			this.prefixEscaped = $(bimp.parser.xmlFile)[0].documentElement.prefix + "\\:";
			//TODO: OH MY :O ...? FIX ASAP
			// this next line should have never been written, NEVER
			if ($(bimp.parser.xmlFile).find(this.prefixEscaped + "startEvent").size() < $(bimp.parser.xmlFile).find("startEvent").size()) {
				// if we need to use prefix (we get results) then use it, otherwise don't
				this.prefixEscaped = "";
				this.prefix = "";
			}
		}
	},
	readStartEvent : function() {
		//console.log("xmlFile", this.xmlFile);
		var doc = $(this.xmlFile).find(bimp.parser.prefixEscaped + "startEvent").find(bimp.parser.prefixEscaped + "documentation");
		if (doc.length > 0) {
			//console.log("Found startEvent and added it");
			var simInfo = $.parseJSON(doc.text());
			$.extend(true, this.startEvent, simInfo);
		} else {
			//console.log("No documentation info found for startEvent");
		}
		return true;
	},
	readTasks : function() {
		var tasks = $(this.xmlFile).find(bimp.parser.prefixEscaped + "task");
		//console.log("Found",tasks.length,"tasks");
		$(tasks).each(function(index, task){
			var data = $(task).find(bimp.parser.prefixEscaped + "documentation");
			var taskObj = {};
			if (data.length > 0) {
				taskObj = $.parseJSON($(data).text());
			}
			var id = task.getAttribute("id");
			var name = {
					name : task.getAttribute("name")
			};
			$.extend(true, taskObj, name);
			bimp.parser.addTask(id, taskObj);
			//console.log("Added task", name," with id =", id);
		});
		return true;
	},
	readIntermediateCatchEvents : function() {
		var events = $(this.xmlFile).find(bimp.parser.prefixEscaped + "intermediateCatchEvent");
		//console.log("Found", events.length, "intermediateCatchEvents");
		$(events).each(function(index, event){
			bimp.parser.hasIntermediatecatchEvents = true;
			var data = $(event).find(bimp.parser.prefixEscaped + "documentation");
			var catchEventObj = {};
			if (data.length > 0) {
				catchEventObj = $.parseJSON($(data).text());
			}
			//TODO: check if it works with multiple catchEvents also..
			var id = event.getAttribute("id");
			var name = {
					name : event.getAttribute("name")
			};
			$.extend(true, catchEventObj, name);
			bimp.parser.addIntermediateCatchEvent(id, catchEventObj);
			//console.log("Added catchEvent with id =", id);
		});
		return true;
	},
	readConditionExpressions : function() {
		sequenceFlows = $(this.xmlFile).find(bimp.parser.prefixEscaped + "sequenceFlow");
		// TODO: find sequenceflows where sourceRef is XOR or OR split gateway 
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
					value = conditionExpression[0].textContent;
				}
				//console.log("Found conditionExpression and added it");
				var targetRef = sequenceFlow.getAttribute("targetRef");
				var targetName = $(bimp.parser.xmlFile).find("#" + targetRef)[0].getAttribute("name");
				
				var id = sequenceFlow.getAttribute("id");
				ce = new bimp.parser.conditionExpression(id, targetRef, sourceRef, value,
						type, targetName ? (targetName.trim != "" ? targetName : "N/A") : "N/A");
				bimp.parser.hasConditionExpressions = true;
				bimp.parser.conditionExpressions[id] = ce;
			}
		});
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
				result = "XOR";
			}
		});
		$(inclusiveGateways).each(function(index, inclusiveGateway) {
			if (inclusiveGateway.getAttribute("id") == id && 
					(inclusiveGateway.getAttribute("gatewayDirection") == "diverging" ||
					inclusiveGateway.getAttribute("gatewayDirection") == "mixed") ||
					bimp.parser.countSequenceFlowsFromGateway(id) > 1) {
				result = "OR";
			}
		});
		return result;	
	},
	countSequenceFlowsFromGateway : function (id) {
		var count = 0;
		sequenceFlows = $(this.xmlFile).find(bimp.parser.prefixEscaped + "sequenceFlow");
		$(sequenceFlows).each(function(index, sequenceFlow) {
			var sourceRef = sequenceFlow.getAttribute("sourceRef");
			var sourceRefNodeName = $(this.xmlFile).find("#" + sourceRef).nodeName;
			if (sourceRefNodeName === "exclusiveGateway" || sourceRefNodeName === "inclusiveGateway") {
				if (sourceRef === id) {
					count += 1;
				}
			}
		});
		return count;
	}
};