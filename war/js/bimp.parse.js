bimp.parser = {
	xmlFile : "",
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
	addTask : function (id, type, mean, value, stdev, min, max, resource, fixedCost) {
		this.tasks[id] = {
			durationDistribution : {
				"type" : "",
				"mean" : "",
				"value" : "",
				"stdev" : "",
				"min" : "",
				"max" : ""
			},
			"resource" : resource,
			"fixedCost" : fixedCost
		};
	},
	intermediateCatchEvents : {},
	
	addIntermediateCatchEvent : function (id, type,value){
		this.intermediateCatchEvents[id] = {
				durationDistribution : {
				"type" : "",
				"mean" : "",
				"value" : "",
				"stdev" : "",
				"min" : "",
				"max" : ""
			}
		};
	},
	init : function () {
		this.xmlFile = bimp.file.xmlFile;
	},
	readStartEvent : function() {
		var doc = $(this.xmlFile).find("startEvent").find("documentation");
		console.log(doc)
		if (doc.length > 0) {
			console.log("Found startEvents documentation info");
			simInfo = $.parseJSON(doc.text());
			console.log(simInfo);
		} else {
			console.log("No documentation info found for startEvent");
		}
	},
	readTask : function() {
		
	},
	readIntermediateCatchEvent : function() {
		
	}
	
};