bimp.parser = {
	xmlFile : "",
	start : function () {
		this.readStartEvent();
		this.readTasks();
		this.readIntermediateCatchEvents();
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
	},
	readTasks : function() {
		var tasks = $(this.xmlFile).find("task");
		console.log("Found",tasks.length,"tasks");
		$(tasks).each(function(index, task){
			var data = $(task).find("documentation");
			var taskObj = $.parseJSON($(data).text());
			var id = data[0].getAttribute("id");
			bimp.parser.addTask(id, taskObj);
			console.log("Added task with id =", id);
		});
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
	}
	
};