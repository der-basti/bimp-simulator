bimp.forms = {
		defaultBeginTime: "09:00:00",
		defaultEndTime: "17:00:00",
		generate : {
			start : function () {
				this.startEvent("test");
				this.tasks();
				this.conditionExpressions();
				this.intermediateCatchEvents();
				bimp.forms.groupGateways();
				bimp.forms.setDefaultXORValues();
				removeLastButton();
				$(".currencyText").text($(".currency").val());
			},
			startEvent : function (name) {
				var se = bimp.parser.startEvent;
				
				var id = $(bimp.parser.xmlFile).find(bimp.parser.prefixEscaped + "startEvent")[0].getAttribute("id");
				$(".startEvent").attr("data-id", id);
				
				bimp.forms.populateWithData(".startEvent", se);
				$.each(se.resources, function(name, resource) {
					bimp.forms.generate.resource(name, resource);
				});
				$.each(se.timetable, function(name, timetable){
					bimp.forms.generate.timetable(name, timetable);
				});
			},
			resource : function (name, resourceObj) {
				//console.log(name, resourceObj);
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
					//console.log("days:", days, "times:", times);
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
				if (!bimp.parser.hasConditionExpressions) {
					$(".gateways").parent().hide();
					$(".gateways").parent().prev().hide();
				} else {
					$.each(bimp.parser.conditionExpressions, function(id, ce) {
						bimp.forms.generate.conditionExpression(id, ce);
					});
				}
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
				//console.log(name, " - ", value);
				if (name === "name" && value === "") {
					value = "N/A";
				}
				if (value == "0" || value == 0) {
					value = "";
				}
				if (typeof(value) == "object") {
					$.each(value, function(_name, _value) {
						if (typeof(_value) !== "object") {
							if (["min", "max", "value", "mean", "stdev"].indexOf(_name) > -1) {
								var timeUnit = value["timeUnit"];
								_value = convertSecondsToX(_value, timeUnit);
								if (_value == 0 || _value == "0") {
									_value = "";
								}
							}
							clone ? $(htmlObj).find("." + _name).val(_value) : $(selector +" ." + _name).val(_value);
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
						var dateAndTime = new Date();
						if (startAtDate == "" || !startAtDate) {
							startAtDate = dateAndTime.getFullYear() + "-" + (dateAndTime.getMonth()+1) + "-" + dateAndTime.getDate();
						}
						if (startAtTime == "" || !startAtTime) {
							startAtTime = dateAndTime.toLocaleTimeString();
						}
						$(selector +" ." + name + "Date").val(startAtDate);
						$(selector +" ." + name + "Time").val(startAtTime);
					} else if (name == "currency"){
						clone ? $(htmlObj).find("." + name).val(value) : $(selector +" ." + name).val(value);
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
				if (bimp.parser.hasConditionExpressions) {
					var gateways = $(".gateways .gateway");
					$(gateways).each(function (index, element) {
						bimp.forms.read.readData(element, bimp.parser.conditionExpressions[$(element).attr("data-id")]);
					});
				}
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
//									//console.log("Reading", name, "with value", value);
//									obj[name][_name] = $(selector + " ." + _name).val();
//								});
//							}
//							bimp.forms.read.readData(selector + " ." + name, value);
							if (name == "durationDistribution" || name == "arrivalRateDistribution") {
								var timeUnit = $(selector).find(".timeUnit").val();
								$.each(value, function (_name, _value) {
									var fieldValue = $(selector).find("." + _name).val();
									if (fieldValue == "") {
										fieldValue = "0";
									}
									if (timeUnit != "seconds" && ["min", "max", "value", "mean", "stdev"].indexOf(_name) > -1) {
										// convert the value to seconds according to selected timeunit
										fieldValue = convertToSeconds(fieldValue, timeUnit);
									}
									obj[name][_name] = fieldValue;
									//console.log("Reading ", _name, "with value", $(selector).find("." + _name).val());
								});
							}
						} else {
							// lets read field values
							if (name == "probability") {
								obj[name] = $(selector).find("." + name).val() / 100;
							} else if (name == "startAt"){
								obj[name] = $(selector).find("." + name + "Date").val() + " " + $(selector).find("." + name + "Time").val();
							} else {
								var value = $(selector).find("." + name).val();
								if (value == "") {
									value = "0";
								}
								obj[name] = value;
							}
							//console.log("Reading ", name, "with value", $(selector).find("." + name).val());
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
				if ($(gateway).find(".type").text() == "Exclusive (XOR)") {
					//console.log("xor");
					if ($("#xor_" + sourceRef).size() > 0) {
						$(clone).find("tr:first").hide();
						$(clone).find("tr th div").slice(0, 2).css({"visibility":"hidden", "overflow-y":"hidden", "height":"0"});
						$("#xor_" + sourceRef).append(clone);
					} else {
						var container = $("<div class='gatewayGroup xor' id='xor_" + sourceRef + "'></div>").append(clone);
						$(".gateways").append(container);
					}
				} else {
					if ($("#" + sourceRef).size() > 0) {
						$(clone).find("tr:first").hide();
						$(clone).find("tr th div").slice(0, 2).css({"visibility":"hidden", "overflow-y":"hidden", "height":"0"});
						$("#" + sourceRef).append(clone);
					} else {
						var container = $("<div class='gatewayGroup' id='" + sourceRef + "'></div>").append(clone);
						$(".gateways").append(container);
					}
				}
				$(gateway).remove();
			});
		},
		setDefaultXORValues : function () {
			$(".gatewayGroup.xor").each(function (index, group) {
				var probs = $(group).find(".probability");
				if ($(probs[0]).val() == "") {
					$(probs).val(Math.round((100 / probs.length)*100) / 100);
				}
			});
		}
};

function convertToSeconds (value, timeUnit) {
	switch (timeUnit) {
		case ("minutes"):
			return value * 60;
		break;
		case ("hours"):
			return value * 60 * 60;
		break;
		case ("days"):
			return value * 60 * 60 * 24;
		break;
		default:
			return value;
		break;
	}
}

function convertSecondsToX(value, timeUnit) {
	switch (timeUnit) {
		case ("minutes"):
			return value / 60;
		break;
		case ("hours"):
			return value / 60 / 60;
		break;
		case ("days"):
			return value / 60 / 60 / 24;
		break;
		default:
			return value;
		break;
	}
}