bimp.parser = {
	xmlFile : "",
	start : function () {
		this.readStartEvent();
		this.readTasks();
		this.readIntermediateCatchEvents();
		this.readConditionExpressions();
		console.log("Finished reading data");
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
		this.fixedCost = ""
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
	conditionExpression : function(id, targetRef, sourceRef, value) {
		this.id = id;
		this.targetRef = targetRef;
		this.sourceRef = sourceRef;
		this.value = value;
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
			var taskObj = $.parseJSON($(data).text());
			//TODO: test if data[0] fails in some cases
			var id = data[0].getAttribute("id");
			bimp.parser.addTask(id, taskObj);
			console.log("Added task with id =", id);
		});
		return true;
	},
	readIntermediateCatchEvents : function() {
		var events = $(this.xmlFile).find("intermediateCatchEvent");
		console.log("Found", events.length, "intermediateCatchEvents");
		$(events).each(function(index, event){
			var data = $(event).find("documentation");
			var catchEventObj = $.parseJSON($(data).text());
			//TODO: check if it works with multiple catchEvents also..
			var id = event.getAttribute("id");
			bimp.parser.addIntermediateCatchEvent(id, catchEventObj);
			console.log("Added catchEvent with id =", id);
		});
		return true;
	},
	readConditionExpressions : function() {
		sequenceFlows = $(this.xmlFile).find("sequenceFlow");
		$(sequenceFlows).each(function(index, sequenceFlow){
			var conditionExpression = $(sequenceFlow).find("conditionExpression");
			if (conditionExpression.length > 0) {
				console.log("Found conditionExpression and added it");
				var id = sequenceFlow.getAttribute("id");
				var targetRef = sequenceFlow.getAttribute("targetRef");
				var sourceRef = sequenceFlow.getAttribute("sourceRef");
				var value = sequenceFlow.textContent;
				ce = new bimp.parser.conditionExpression(id, targetRef, sourceRef, value);
				console.log("conditionExpression", ce);
				bimp.parser.conditionExpressions.push(ce);
			}
		});
		return true;
	}
};