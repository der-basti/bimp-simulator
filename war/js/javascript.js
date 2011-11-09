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
		$(row).find(".startday").val("Mon");
		$(row).find(".endday").val("Fri");
		$(row).find(".begintime").val("09:00:00");
		$(row).find(".endtime").val("17:00:00");
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
		$("#instructions").hide();
		$("#upload-area").fadeOut(400, function() {$("#data-input").fadeIn(1000);});
		$("#startSimulationButton").fadeIn(1000);
		$("#logCheckBox").fadeIn(1000);
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
	
	$("#downloadBpmn").click(function () {
		$('#download').val('bpmn');
		$('#hiddenDownloadForm').submit();
	});
	
	$("#downloadLog").click(function () {
		$('#download').val('log');
		$('#hiddenDownloadForm').submit();
	});
	
	$(".highlightSources").click(function () {
		$(".gateway").removeClass("highlight");
		var id=$(this).parents(".task").attr("data-id");
		$(".gateway").each(function (i, element) {
			//console.log($(element).find(".sourceRef").text());
			if ($(element).find(".sourceRef").text() === id) {
				$(element).addClass("highlight");
			}
		});
	});
	$(".highlightTargets").click(function () {
		$(".gateway").removeClass("highlight");
		var id=$(this).parents(".task, .startEvent").attr("data-id");
		$(".gateway").each(function (i, element) {
			if ($(element).find(".targetRef").text() === id) {
				$(element).addClass("highlight");
			}
		});
	});
	$("body").delegate(".currency", "change", function () {
		$(".currencyText").text($(this).val());
	});
	
	$(".help-nav-button").click(function() {
		var clickedButton = $(this);
		$(".help-text").each(function () {
			if ($(this).is(":visible")) {
				if ($(this).attr("id") == "bimp-help" && $(clickedButton).attr("id")=="bimp-help-trigger"
					|| $(this).attr("id") == "bimp2-help" && $(clickedButton).attr("id")=="bimp2-trigger"
					|| $(this).attr("id") == "bimpeditors-help" && $(clickedButton).attr("id")=="bimpeditors-trigger"
					|| $(this).attr("id") == "ui-help" && $(clickedButton).attr("id")=="ui-help-trigger") {
					return false;
				}
				$(this).slideUp(500, function () {
					if ($(clickedButton).attr("id")=="bimp-help-trigger") {
						$("#bimp-help").slideDown(500);
					}
					if ($(clickedButton).attr("id")=="bimp2-trigger") {
						$("#bimp2-help").slideDown(500);
					}
					if ($(clickedButton).attr("id")=="bimpeditors-trigger") {
						$("#bimpeditors-help").slideDown(500);
					}
					if ($(clickedButton).attr("id")=="ui-help-trigger") {
						$("#ui-help").slideDown(500);
					}
				});
				return false;
			}	
		});
	});
	
	$("#contactForm").click(function() {
		if ($("#txtCaptcha").val()=="") {
			DrawCaptcha();
		}
	});
	
	$("#captchaRefresh").click(function() {
		DrawCaptcha();
	});
	
	$("body").delegate("#backToEditData", "click", function() {
		$("#resultsPage").fadeOut("fast", function() {
			$(this).remove();
		});
		$("#uploadPage").fadeIn("fast");
	});
//	openLoadingModal();
});

var timeTableRow;

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
		if ($(that).parent().parent().hasClass("timetable")) {
			$(that).append($("<option></option>").attr("value", "*").text("*"));
		}
		$.each(bimp.parser.startEvent.resources, function(resourceName, resource) {
			$(that).append($("<option></option>").attr("value", resourceName).text(resource.name));
		});

	});
};

var updateResourceId = function (element) {
	// generating resource id from resources name, NB: resource names have to be unique
	var id = $(element).val().replace(/ /g, "");
	$(element).parent().parent().attr("data-id", id);
};

var updateAllTypeSelections = function () {
	$("select.type").each(function () {
		updateTypeSelection(this);
	});
};

var updateTypeSelection = function (element) {
	// update the fields to be show for selected duration option values
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

var openLoadingModal = function () {
	$("body").append("<div id='modal-bg'></div>");
	$("body").append("<div id='loading'>" +
			"<h2>Running your simulation, please wait</h2>" +
			"<h2 class='status'>Status</h2>" +
			"<div class='progressBarContainer'><div class='progressBar'></div></div>" +
			"<h2 class='progress'>Progress</h2>" +
			"</div>");
	var left = (document.width - $("#loading").width()) / 2;
	$("#loading").css({"left":left});
	
	$.ajax({
		contentType : 'application/json',
		type : 'get',
		url : '/simulate',
		success : function() {
			console.log("simulation ended");
		},
		error : function(e) {
			console.log(e);
		}

	});
	timerId = setInterval("getStatus()", interval);
	$("#modal-bg").fadeIn();
	$("#loading").fadeIn();
};

var closeLoadingModal = function () {
	$("#loading").fadeOut().remove();
	$("#modal-bg").fadeOut().remove();
};

getStatus = function() {
	//getting the status of the simulation
	timer += interval;
	if (timer > 500000) {
		clearInterval(timerId);
		window.location = "/getResults";
	}
	$.ajax({
		contentType : 'application/json',
		type : 'post',
		url : '/getStatus',
		success : function(data) {
			switch (data.status) {
			case ("INITIALIZING"):
				if (pointCount < 3) {
					pointCount += 1;
					$(".status").text(data.status + generateXCharacters(pointCount, "."));
				} else {
					pointCount = 0;
				}
				break;
			case ("STARTED"):
				$(".progressBarContainer").fadeIn();
				var width = data.progress.split("/")[0] / data.progress.split("/")[1] * 100 + "%";
				$(".progressBar").css({"width":width});
				if (pointCount < 3) {
					pointCount += 1;
					$(".status").text(data.status + generateXCharacters(pointCount, "."));
				} else {
					pointCount = 0;
				}
				break;
			case ("FINALIZING"):
				$(".progressBarContainer").fadeOut();
				if (pointCount < 3) {
					pointCount += 1;
					$(".status").text(data.status + " and writing logs" + generateXCharacters(pointCount, "."));
				} else {
					pointCount = 0;
				}
				break;
			case ("FINISHED"):
				clearInterval(timerId);
//				window.location = "/getResults";
				$.ajax({
					type : 'get',
					url : '/getResults',
					success : function(data) {
						$("#uploadPage").fadeOut();
						$("#header").after(data);
						closeLoadingModal();
					}
				});
				break;
			}
			$(".progress").text(data.progress);
		},
		error : function(e) {
			console.log(e);
			clearInterval(timerId);
		}

	});
};

var preloadTaskResources = function () {
	var resources = $(bimp.parser.xmlFile).find(bimp.parser.prefixEscaped + "lane");
	$(resources).each(function (index, resource) {
		flowNodeRefs = $(resource).find(bimp.parser.prefixEscaped + "flowNodeRef");
		var resourceId = $(resource).attr("id");
		$(flowNodeRefs).each(function (index, flowNode) {
			var taskId = $(flowNode).text();
			var target = $(bimp.parser.xmlFile).find("#" + taskId)[0];
			// since nodeName returns name with prefix, then perform check for prefix (chrome)
			if (target.nodeName.split(":").length > 1 ? target.nodeName.split(":")[1]:target.nodeName  == bimp.parser.prefix + "task") {
				$(".task").each(function (index, element) {
					if ($(element).attr("data-id") == taskId) {
						$(element).find(".resource").val(resourceId);
					}
				});
			}
		});
	});
};

var generateXCharacters = function (x, character) {
	var result = "";
	for (var i = 0; i<x; i++) {
		result = result + character;
	}
	return result;
};

function DrawCaptcha() {
    var a = Math.ceil(Math.random() * 10)+ '';
    var b = Math.ceil(Math.random() * 10)+ '';       
    var c = Math.ceil(Math.random() * 10)+ '';  
    var d = Math.ceil(Math.random() * 10)+ '';  
    var e = Math.ceil(Math.random() * 10)+ '';  
    var f = Math.ceil(Math.random() * 10)+ '';  
    var g = Math.ceil(Math.random() * 10)+ '';  
    var code = a + ' ' + b + ' ' + ' ' + c + ' ' + d + ' ' + e + ' '+ f + ' ' + g;
    $("#txtCaptcha").val(code);
}

function ValidCaptcha() {
    var str1 = removeSpaces($("#txtCaptcha").val());
    var str2 = removeSpaces($("#txtInput").val());
    if (str1 == str2) return true;        
    return false;
}

function removeSpaces(string) {
    return string.split(' ').join('');
}

var pointCount = 0;
var interval = 500;
var timerId = "";
var timer = 0;