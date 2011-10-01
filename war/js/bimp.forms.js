bimp.forms = {
		generate : {
			start : function() {
				this.startEvent("test");
				this.tasks();
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
					bimp.forms.populateWithData(".resources tbody", resourceObj, true, resourceHTML);
					
				}
			},
			timetable : function(name, timetableObj) {
				//TODO: DATE AND TIME!
				// use populateWithData?
				console.log("TT", name,timetableObj)
				if(!$(".timetables .timetable:first").attr("data-name")) {
					$.each(bimp.parser.startEvent.resources, function(resourceName, resource) {
						$(".timetables .timetable .resource").append($("<option></option>").attr("value", resourceName).text(resourceName));
					});
					$(".timetables .timetable").attr("data-name", name);
					$(".timetables .timetable .resource").val(name);
				} else {
					var timetableHTML = $(".timetables .timetable:first").clone(true);
					$(timetableHTML).find(".resource").val(name);
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
					bimp.forms.populateWithData(".tasks", taskObj, true, taskHTML);
				}
			}
			
		},
		validate : function() {
			
		},
		read : function() {
			
		},
		populateWithData : function (selector, obj, clone, htmlObj) {
			$.each(obj, function(name, value){
				console.log("name:",name,"value:",value);
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
		}
};