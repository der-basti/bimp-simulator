bimp.parser = {
	xmlFile : "",
	start : function () {
		this.readStartEvent();
		this.readTasks();
		this.readIntermediateCatchEvents();
		this.readConditionExpressions();
		console.log("Finished reading data");
		bimp.forms.generate.start();
	},
	startEvent : {
		arrivalRateDistribution : {
			type : "",
			mean : "",
			value : "",
			stdev : "",
			min : "",
			max : ""
		},
		instances : "",
		resources : {},
		startAt : "",
		timetable : {},
		addResource : function(id,name, costPerHour, amount) {
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
			"mean" : "",
			"value" : "",
			"stdev" : "",
			"min" : "",
			"max" : ""
		},
		this.resource = "",
		this.fixedCost = "",
		this.name = ""
	},
	addTask : function (id, taskObj) {
		this.tasks[id] = $.extend(new bimp.parser.task(), taskObj);
		
	},
	intermediateCatchEvents : {},
	intermediateCatchEvent : function() {
		this.durationDistribution = {
			"type" : "",
			"mean" : "",
			"value" : "",
			"stdev" : "",
			"min" : "",
			"max" : ""
		}
	},
	addIntermediateCatchEvent : function (id, catchEventObj){
		this.intermediateCatchEvents[id] =  $.extend(new bimp.parser.intermediateCatchEvent(), catchEventObj);
	},
	conditionExpressions : [],
	conditionExpression : function(id, targetRef, sourceRef, value, type) {
		this.id = id;
		this.targetRef = targetRef;
		this.sourceRef = sourceRef;
		this.probability = value;
		this.type = type;
	},
	init : function () {
		this.xmlFile = bimp.file.xmlFile;
	},
	readStartEvent : function() {
		console.log("xmlFile", this.xmlFile);
		var doc = $(this.xmlFile).find("startEvent").find("documentation");
		if (doc.length > 0) {
			console.log("Found startEvent and added it");
			var simInfo = $.parseJSON(doc.text());
			$.extend(this.startEvent, simInfo);
		} else {
			console.log("No documentation info found for startEvent");
		}
		return true;
	},
	readTasks : function() {
		var tasks = $(this.xmlFile).find("task");
		console.log("Found",tasks.length,"tasks");
		$(tasks).each(function(index, task){
			var data = $(task).find("documentation");
			var taskObj = {};
			if (data.length > 0) {
				taskObj = $.parseJSON($(data).text());
			}
			var id = task.getAttribute("id");
			var name = {
					name : task.getAttribute("name")
			};
			$.extend(taskObj, name);
			bimp.parser.addTask(id, taskObj);
			console.log("Added task", name," with id =", id);
		});
		return true;
	},
	readIntermediateCatchEvents : function() {
		var events = $(this.xmlFile).find("intermediateCatchEvent");
		console.log("Found", events.length, "intermediateCatchEvents");
		$(events).each(function(index, event){
			var data = $(event).find("documentation");
			var catchEventObj = {};
			if (data.length > 0) {
				catchEventObj = $.parseJSON($(data).text());
			}
			//TODO: check if it works with multiple catchEvents also..
			var id = event.getAttribute("id");
			var name = {
					name : event.getAttribute("name")
			};
			$.extend(catchEventObj, name);
			bimp.parser.addIntermediateCatchEvent(id, catchEventObj);
			console.log("Added catchEvent with id =", id);
		});
		return true;
	},
	readConditionExpressions : function() {
		sequenceFlows = $(this.xmlFile).find("sequenceFlow");
		// TODO: find sequenceflows where sourceRef is XOR or OR split gateway 
		// gatewayDirection="diverging" or gatewayDirection="mixed";
		// XOR = exclusiveGateway, sum for XORs have to be 100%
		// OR = inclusiveGateway, are independent
		
		$(sequenceFlows).each(function(index, sequenceFlow){
			var sourceRef = sequenceFlow.getAttribute("sourceRef");
			var type = bimp.parser.findSplitGateway(sourceRef);
			if (type !== null) {
				var conditionExpression = $(sequenceFlow).find("conditionExpression");
				var value = "";
				if (conditionExpression.length > 0) {
					value = conditionExpression[0].textContent;
				}
				console.log("Found conditionExpression and added it");
				var targetRef = sequenceFlow.getAttribute("targetRef");
				var id = sequenceFlow.getAttribute("id");
				ce = new bimp.parser.conditionExpression(id, targetRef, sourceRef, value, type);
				console.log("conditionExpression", ce);
				bimp.parser.conditionExpressions.push(ce);
			}
		});
		return true;
	},
	findSplitGateway : function(id) {
		var result = null;
		var exclusiveGateways = $(this.xmlFile).find("exclusiveGateway");
		var inclusiveGateways = $(this.xmlFile).find("inclusiveGateway");
		$(exclusiveGateways).each(function(index, exclusiveGateway) {
			if (exclusiveGateway.getAttribute("id") == id && 
					(exclusiveGateway.getAttribute("gatewayDirection") == "diverging" ||
					exclusiveGateway.getAttribute("gatewayDirection") == "mixed")) {
				result = "XOR";
			}
		});
		$(inclusiveGateways).each(function(index, inclusiveGateway) {
			inclusiveGateway.getAttribute("id")
			if (inclusiveGateway.getAttribute("id") == id && 
					(inclusiveGateway.getAttribute("gatewayDirection") == "diverging" ||
					inclusiveGateway.getAttribute("gatewayDirection") == "mixed")) {
				result = "OR";
			}
		});
		return result;	
	}
};