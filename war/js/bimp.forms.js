bimp.forms = {
		generate : {
			start : function () {
				this.startEvent("test");
				this.tasks();
				this.conditionExpressions();
				this.intermediateCatchEvents();
				bimp.forms.groupGateways();
				removeLastButton;
			},
			startEvent : function (name) {
				var se = bimp.parser.startEvent;
				
				bimp.forms.populateWithData(".startEvent", se);
				$.each(se.resources, function(name, resource) {
					bimp.forms.generate.resource(name, resource);
				});
				$.each(se.timetable, function(name, timetable){
					bimp.forms.generate.timetable(name, timetable);
				});
			},
			resource : function (name, resourceObj) {
				console.log(name, resourceObj);
				if (!$(".resources .resource:first").attr("data-id")){
					bimp.forms.populateWithData(".resources", resourceObj);
					$(".resources .resource:first").attr("data-id", name);
				} else {
					var resourceHTML = $(".resources .resource:first").clone(true);
					$(resourceHTML).attr("data-id", name);
					bimp.forms.populateWithData(".resources tbody", resourceObj, true, resourceHTML);
					
				}
				$(".resources .resource .remove").show();
			},
			timetable : function (name, timetableObj) {
				//TODO: use populateWithData?
				var days;
				var times;
				try {
					$.each(timetableObj, function(_days, _times) {
						days = _days;
						times = _times;
					});
					console.log("days:", days, "times:", times);
					startday = days.split("-")[0];
					endday = days.split("-")[1];
					begintime = times.split("-")[0];
					endtime = times.split("-")[1];
				} catch (e) {
					console.error("Error getting timetable", e);
				}
				
				if(!$(".timetables .timetable:first").attr("data-name")) {
					$.each(bimp.parser.startEvent.resources, function(resourceName, resource) {
						$(".timetables .timetable .resource").append($("<option></option>").attr("value", 
								resourceName).text(resource.name));
					});
					$(".timetables .timetable .resource").val(name);
					$(".timetables .timetable .startday").val(startday);
					$(".timetables .timetable .endday").val(endday);
					$(".timetables .timetable .begintime").val(begintime);
					$(".timetables .timetable .endtime").val(endtime);
					$(".timetables .timetable").attr("data-name", name);
				} else {
					var timetableHTML = $(".timetables .timetable:first").clone(true);
					$(timetableHTML).find(".resource").val(name);
					$(timetableHTML).find(".startday").val(startday);
					$(timetableHTML).find(".endday").val(endday);
					$(timetableHTML).find(".begintime").val(begintime);
					$(timetableHTML).find(".endtime").val(endtime);
					$(timetableHTML).attr("data-name", name);
					$(".timetables tbody").append(timetableHTML);
				}
			},
			tasks : function () {
				$.each(bimp.parser.tasks, function(id, task) {
					bimp.forms.generate.task(id, task);
				});
			},
			task : function (id, taskObj) {
				if(!$(".tasks .task:first").attr("data-id")) {
					$(".tasks .task .id").text(id);
					bimp.forms.populateWithData(".tasks .task", taskObj);
					$(".tasks .task:first").attr("data-id", id);
				} else {
					var taskHTML = $(".tasks .task:first").clone(true);
					$(taskHTML).find(".id").text(id);
					$(taskHTML).attr("data-id", id);
					bimp.forms.populateWithData(".tasks", taskObj, true, taskHTML);
				}
			},
			conditionExpressions : function () {
				$.each(bimp.parser.conditionExpressions, function(id, ce) {
					bimp.forms.generate.conditionExpression(id, ce);
				});
			},
			conditionExpression : function (id, gatewayObj) {
				if(!$(".gateways .gateway:first").attr("data-id")) {
					bimp.forms.populateWithData(".gateways .gateway", gatewayObj);
					$(".gateways .gateway:first").attr("data-id", gatewayObj.id);
				} else {
					var gatewayHTML = $(".gateways .gateway:first").clone(true);
					$(gatewayHTML).attr("data-id", gatewayObj.id);
					bimp.forms.populateWithData(".gateways", gatewayObj, true, gatewayHTML);
				}
			},
			intermediateCatchEvents : function() {
				// if we have no intermediateEvents, then hide the div and h2
				if (!bimp.parser.hasIntermediatecatchEvents) {
					$(".intermediateCatchEvent").hide();
				} else {
					$.each(bimp.parser.intermediateCatchEvents, function(id, ice) {
						bimp.forms.generate.intermediateCatchEvent(id, ice);
					});
				}
			},
			intermediateCatchEvent : function (id, eventObj) {
				if(!$(".catchEvents .catchEvent:first").attr("data-id")) {
					bimp.forms.populateWithData(".catchEvents .catchEvent", eventObj);
					$(".catchEvents .catchEvent:first").attr("data-id", id);
				} else {
					var eventHTML = $(".catchEvents .catchEvent:first").clone(true);
					$(eventHTML).attr("data-id", id);
					bimp.forms.populateWithData(".catchEvents", eventObj, true, eventHTML);
				}
			}
			
		},
		populateWithData : function (selector, obj, clone, htmlObj) {
			$.each(obj, function(name, value){
				console.log(name, " - ", value);
				if (typeof(value) == "object"){
					$.each(value, function(name, value) {
						if (typeof(value) !== "object") {
							clone ? $(htmlObj).find("." + name).val(value) : $(selector +" ." + name).val(value);
						}
					});
				} else if (name === "resource") {
					if (!clone) {
						$.each(bimp.parser.startEvent.resources, function(resourceName, resource) {
							$(selector +" ." + name).append($("<option></option>").attr("value", 
									resourceName).text(resource.name));
						});
					}
					clone ? $(htmlObj).find("." + name).val(value) : $(selector +" ." + name).val(value); 
					
				}
				 else {
					if (name == "probability") {
						clone ? $(htmlObj).find("." + name).val(value * 100) : $(selector +" ." + name).val(value * 100);
					} else if (name == "startAt"){
						var startAt = value;
						var startAtDate = startAt.split(" ")[0];
						var startAtTime = startAt.split(" ")[1];
						$(selector +" ." + name + "Date").val(startAtDate);
						$(selector +" ." + name + "Time").val(startAtTime);
					} else {
						clone ? $(htmlObj).find("." + name).text(value) : $(selector +" ." + name).text(value);
						clone ? $(htmlObj).find("." + name).val(value) : $(selector +" ." + name).val(value);
					}
				}
			});
			clone ? $(selector).append(htmlObj) : true;
		},
		validate : function () {
			
		},
		read : {
			start : function () {
				this.startEvent();
				this.tasks();
				this.conditionExpressions();
				this.intermediateCatchEvents();
			},
			startEvent : function () {
				var selector = ".startEvent";
				this.readData(selector, bimp.parser.startEvent);
				this.resources();
				this.timetable();
			},
			resources : function () {
				var resources = $(".resources .resource");
				bimp.parser.startEvent.resources = {};
				$(resources).each( function(index, element) {
					bimp.parser.startEvent.addResource($(element).attr("data-id"), 
							$(element).find(".name").val(), $(element).find(".costPerHour").val(), $(element).find(".amount").val());
				});
			},
			timetable : function () {
				var timetable = $(".timetables .timetable");
				bimp.parser.startEvent.timetable = {};
				$(timetable).each(function (index, element){
					var startDay = $(element).find(".startday").val();
					var endDay = $(element).find(".endday").val();
					var beginTime = $(element).find(".begintime").val();
					var endTime = $(element).find(".endtime").val();
					
					var dayString = startDay === endDay ? startDay : startDay + "-" + endDay;
					var timeString = beginTime + "-" + endTime;
					var tmp = {};
					tmp[dayString] = timeString;
					// if we have this resource already, then add new values to it
					if (bimp.parser.startEvent.timetable[$(element).find(".resource").val()]) {
						$.extend(true, bimp.parser.startEvent.timetable[$(element).find(".resource").val()], 
								tmp);
					} else {
						bimp.parser.startEvent.timetable[$(element).find(".resource").val()] = tmp;
					}
				});
			},
			tasks : function () {
				var tasks = $(".tasks .task");
				$(tasks).each(function (index, element) {
					bimp.forms.read.readData(element, bimp.parser.tasks[$(element).attr("data-id")]);
				});
			},
			conditionExpressions : function () {
				var gateways = $(".gateways .gateway");
				$(gateways).each(function (index, element) {
					bimp.forms.read.readData(element, bimp.parser.conditionExpressions[$(element).attr("data-id")]);
				});
			},
			intermediateCatchEvents : function () {
				var events = $(".catchEvents .catchEvent");
				if (bimp.parser.hasIntermediatecatchEvents) {
					$(events).each(function (index, element) {
						bimp.forms.read.readData(element, bimp.parser.intermediateCatchEvents[$(element).attr("data-id")]);
					});
				}
			},
			readData : function (selector, obj) {
				$.each(obj, function(name, value) {
					if (typeof(value) !== "function") {
						if (typeof(value) == "object") {
//							if (name !== "resources" && name !== "timetable") {
//								$.each(value, function (_name, _value) {
//									console.log("Reading", name, "with value", value);
//									obj[name][_name] = $(selector + " ." + _name).val();
//								});
//							}
//							bimp.forms.read.readData(selector + " ." + name, value);
							if (name == "durationDistribution" || name == "arrivalRateDistribution") {
								$.each(value, function (_name, _value) {
									obj[name][_name] = $(selector).find("." + _name).val();
									console.log("Reading ", _name, "with value", $(selector).find("." + _name).val());
								});
							}
						} else {
							// lets read field values
							if (name == "probability") {
								obj[name] = $(selector).find("." + name).val() / 100;
							} else if (name == "startAt"){
								obj[name] = $(selector).find("." + name + "Date").val() + " " + $(selector).find("." + name + "Time").val();
							} else {
								obj[name] = $(selector).find("." + name).val();
							}
							console.log("Reading ", name, "with value", $(selector).find("." + name).val());
						}
					}
				});
			}
		},
		groupGateways : function () {
			var gateways = $(".gateways .gateway");
			$(gateways).each(function (i, gateway) {
				var sourceRef = $(gateway).find(".sourceRef").text();
				var clone = $(gateway).clone(true);
				if ($(gateway).find(".type").text() == "XOR") {
					console.log("xor");
					if ($("#xor_" + sourceRef).size() > 0) {
						$(clone).find(".type").parents("tr:first").hide();
						$("#xor_" + sourceRef).append(clone);
					} else {
						var container = $("<div class='gatewayGroup xor' id='xor_" + sourceRef + "'></div>").append(clone);
						$(".gateways").append(container);
					}
				} else {
					if ($("#" + sourceRef).size() > 0) {
						$(clone).find(".type").parents("tr:first").hide();
						$("#" + sourceRef).append(clone);
					} else {
						var container = $("<div class='gatewayGroup' id='" + sourceRef + "'></div>").append(clone);
						$(".gateways").append(container);
					}
				}
				$(gateway).remove();
			});
		}
};