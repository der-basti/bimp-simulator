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
		if ($(this).parents().find(".timetables").find(".timetable").size() == 0) {
			row = timeTableRow;
		}
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
			  bimp.forms.read.resources();
			  updateResourceDropdowns();
		 });

	});
	
	$("#continue-button").click(function() {
		bimp.parser.init();
		bimp.parser.start();
		$("#upload-area").hide(1000);
		$("#data-input").show(1000);
		$("#startSimulationButton").show(1000);
	});

	$("body").delegate(".remove", "click", function () {
	    var tr = $(this).parent().parent();
	    if ($(tr).hasClass("timetable") && $(".timetable").size() == 1) {
	    	timeTableRow = $(tr).clone(true);
	    }
	    $(tr)
	    .find('td')
	    .wrapInner('<div style="display: block;" />')
	    .parent()
	    .find('td > div')
	    .slideUp(300, function(){
	    	$(this).parent().parent().remove();
	    	bimp.forms.read.resources();
			updateResourceDropdowns();
	    });
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
});
var timeTableRow;
var removeLastButton = function () {
	if ($(".resources .resource").size() == 2) {
		$(".resources .resource .remove").hide();
	}
};

var updateResourceDropdowns = function () {
	$("select.resource").each(function () {
		$(this).find("option").remove();
		var that = this;
		if ($(that).parent().parent().hasClass("timetable")) {
			$(that).append($("<option></option>").attr("value", "*").text("*"));
		}
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