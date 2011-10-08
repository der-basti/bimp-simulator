bimp.forms = {
		generate : {
			start : function() {
				this.startEvent("test");
				this.tasks();
				this.conditionExpressions();
				this.intermediateCatchEvents();
			},
			startEvent : function(name) {
				var se = bimp.parser.startEvent;
				
				bimp.forms.populateWithData(".startEvent", se);
				$.each(se.resources, function(name, resource) {
					bimp.forms.generate.resource(name, resource);
				});
				$.each(se.timetable, function(name, timetable){
					bimp.forms.generate.timetable(name, timetable);
				});
			},
			resource : function(name, resourceObj) {
				console.log(name, resourceObj);
				if (!$(".resources .resource:first").attr("data-id")){
					bimp.forms.populateWithData(".resources", resourceObj);
					$(".resources .resource:first").attr("data-id", name);
				} else {
					var resourceHTML = $(".resources .resource:first").clone(true);
					$(resourceHTML).attr("data-id", name);
					bimp.forms.populateWithData(".resources tbody", resourceObj, true, resourceHTML);
					
				}
			},
			timetable : function(name, timetableObj) {
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
						$(".timetables .timetable .resource").append($("<option></option>").attr("value", resourceName).text(resourceName));
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
			tasks : function() {
				$.each(bimp.parser.tasks, function(id, task) {
					bimp.forms.generate.task(id, task);
				});
			},
			task : function(id, taskObj) {
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
			conditionExpressions : function() {
				$.each(bimp.parser.conditionExpressions, function(id, ce) {
					bimp.forms.generate.conditionExpression(id, ce);
				});
			},
			conditionExpression : function(id, gatewayObj) {
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
				$.each(bimp.parser.intermediateCatchEvents, function(id, ice) {
					bimp.forms.generate.intermediateCatchEvent(id, ice);
				});
			},
			intermediateCatchEvent : function(id, eventObj) {
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
							$(selector +" ." + name).append($("<option></option>").attr("value", resourceName).text(resourceName));
						});
					}
					clone ? $(htmlObj).find("." + name).val(value) : $(selector +" ." + name).val(value); 
					
				}
				 else {
					clone ? $(htmlObj).find("." + name).text(value) : $(selector +" ." + name).text(value);
					clone ? $(htmlObj).find("." + name).val(value) : $(selector +" ." + name).val(value);
				}
			});
			clone ? $(selector).append(htmlObj) : true;
		},
		validate : function() {
			
		},
		read : {
			startEvent : function() {
				$.each(bimp.parser.startEvent, function(name, value) {
					console.log(name, value, typeof (value));
					if (typeof(value) !== "function") {
						if (typeof(value) == "object") {
							// lets read resources and timetable
							// bimp.forms.read[name]();
							console.log("read {}", name)
						} else {
							// lets read field values
							bimp.parser.startEvent[name] = value;
						}
					}
				});
			}
		},
};