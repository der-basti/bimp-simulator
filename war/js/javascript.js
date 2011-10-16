$(document).ready(function () {
	removeLastButton();
	$(".resources .add").click(function () {
		var row = $(this).parents().find(".resources").find(".resource:first").clone(true);
		$(row).find("input").each(function () {
			$(this).val("");
		});
		var tbody = $(this).parents().find(".resources tbody");
		$(row).appendTo(tbody)
		 .find('td')
		 .wrapInner('<div style="display: none;" />')
		 .parent()
		 .find('td > div')
		 .slideDown(300, function(){
			  var $set = $(this);
			  $set.replaceWith($set.contents());
		 });
		$(".resources").find(".remove").show();
	});
	
	$(".timetables .add").click(function () {
		var row = $(this).parents().find(".timetables").find(".timetable:first").clone(true);
		$(row).find("input").each(function () {
			$(this).val("");
		});
		$(row).find(".remove").show();
		var tbody = $(this).parents().find(".timetables tbody");
		$(row).appendTo(tbody)
		 .find('td')
		 .wrapInner('<div style="display: none;" />')
		 .parent()
		 .find('td > div')
		 .slideDown(300, function(){
			  var $set = $(this);
			  $set.replaceWith($set.contents());
		 });
	});
	
	$("#continue-button").click(function() {
		$("#instructions").hide();
		$("#upload-area").fadeOut(400, function() {$("#data-input").fadeIn(1000);});
		$("#startSimulationButton").fadeIn(1000);
	});
	
	$(".toggle-trigger").click(function() {
		$(this).next(".toggle-div").slideToggle("slow", function () {
			if (areAllExpanded()) {
				$(".toggle-all").removeClass("expand");
				$(".toggle-all").text("Collapse all");
			} else {
				$(".toggle-all").addClass("expand");
				$(".toggle-all").text("Expand all");
			};
		});
	});
	
	$(".toggle-all").click(function() {
		
		if ($(this).hasClass("expand")) {
			
			$(".toggle-div").each(function() {
				if (!($(this).is(":visible"))) {
					$(this).slideToggle("slow");
				}
			});
			
			$(".toggle-all").removeClass("expand");;
			$(".toggle-all").text("Collapse all");
		} else {
			$(".toggle-div").each(function() {
				if ($(this).is(":visible")) {
					$(this).slideToggle("slow");
				}
			});
			$(".toggle-all").addClass("expand");;
			$(".toggle-all").text("Expand all");
		}
		
	});
		
	$("body").delegate(".remove", "click", function () {
	     var tr = $(this).parent().parent();
	    
	    $(tr)
	    .find('td')
	    .wrapInner('<div style="display: block;" />')
	    .parent()
	    .find('td > div')
	    .slideUp(300, function(){
	    	$(this).parent().parent().remove();
	    });

	    
	    bimp.forms.read.resources();
		updateResourceDropdowns();
	    removeLastButton();
	});
	
	$("body").delegate(".resource .name", "focusout", function () {
		updateResourceId(this);
		bimp.forms.read.resources();
		updateResourceDropdowns();
	});
	
	$("body").delegate(".type", "change", function () {
		updateTypeSelection(this);
	});
	
	$("#startSimulationButton").click(function () {
		bimp.forms.read.start();
		bimp.file.updateFile();
		bimp.file.uploadFile();
	});
	$(".highlightSources").click(function () {
		$(".gateway").removeClass("highlight");
		var id=$(this).parents(".task").attr("data-id");
		$(".gateway").each(function (i, element) {
			console.log($(element).find(".sourceRef").text());
			if ($(element).find(".sourceRef").text() === id) {
				$(element).addClass("highlight");
			}
		});
	});
	$(".highlightTargets").click(function () {
		$(".gateway").removeClass("highlight");
		var id=$(this).parents(".task, .startEvent").attr("data-id");
		$(".gateway").each(function (i, element) {
			console.log($(element).find(".targetRef").text());
			if ($(element).find(".targetRef").text() === id) {
				$(element).addClass("highlight");
			}
		});
	});
});

var areAllExpanded = function () {
	var result = true;
	$(".toggle-div").each(function ( i, element) {
		if (!($(element).is(":visible"))) {
			result = false;
		}
	});
	return result;
};

var removeLastButton = function () {
	if ($(".resources .resource").size() == 2) {
		$(".resources .resource .remove").hide();
	}
};

var updateResourceDropdowns = function () {
	$("select.resource").each(function () {
		$(this).find("option").remove();
		var that = this;
		$.each(bimp.parser.startEvent.resources, function(resourceName, resource) {
			$(that).append($("<option></option>").attr("value", resourceName).text(resource.name));
		});

	});
};

var updateResourceId = function (element) {
	var id = $(element).val().replace(/ /g, "");
	$(element).parent().parent().attr("data-id", id);
};

var updateAllTypeSelections = function () {
	$("select.type").each(function () {
		updateTypeSelection(this);
	});
};

var updateTypeSelection = function (element) {
	var show = {
			fixed : "value",
			standard : "mean,stdev",
			uniform : "min,max",
			exponential : "mean"
	};
	var selection = $(element).val();
	var toShow = show[selection].split(",");
	$(element).parent().find("input").parent().hide();
	$(toShow).each(function (index, _element) {
		$(element).parent().find("." + _element).parent().show();
	});
};