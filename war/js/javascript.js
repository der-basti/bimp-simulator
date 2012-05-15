$(document).ready(function () {
	
	browserValidation();
	
	loadLikeButton(document, 'script', 'facebook-jssdk');
	removeLastButton();
	if (validate) {
		$.each(validate, function(name, content) {
			$("body").delegate(validate[name]["class"], "change", function() {
				validate.validateField(this, name);
			});
			
			$("body").delegate(validate[name]["class"], "keyup", function() {
				validate.validateField(this, name);
			});
		});
	}
	
	$('body').delegate(".xor", "keyup", function () {
		validateXOR(this);
	});

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
		var row = $(this).parents().find(".timetables").find(".timetable:first").clone(false);
		if ($(this).parents().find(".timetables").find(".timetable").size() == 0) {
			row = timeTableRow;
		}
		$(row).find(".timepicker").removeClass("hasDatepicker");
		$(row).find(".timepicker").attr("id", "");
		$(row).find(".startday").val("Mon");
		$(row).find(".endday").val("Fri");
		$(row).find(".begintime").val(bimp.forms.defaultBeginTime);
		$(row).find(".endtime").val(bimp.forms.defaultEndTime);
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
			  $(".timepicker").timepicker({timeFormat:"hh:mm:ss"});
		 });
	});
	
	$("#continue-button").click(function() {
		$("#continue-button").attr("disabled", true);
		try {
			bimp.parser.start();
			showForm(400);
		} catch (e) {
			bimp.tools.openError("Unable to parse model! See the browser console for details.");
			console.log(e);
		}
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
		if (validateForm()) {
			bimp.forms.read.start();
			bimp.file.updateFile();
			bimp.file.uploadFile();
		}
	});
	
	$("#downloadBpmn").click(function () {
		$('#download').val('bpmn');
		$('#hiddenDownloadForm').submit();
	});
	
	$("#downloadLog").click(function () {
		$('#download').val('log');
		$('#hiddenDownloadForm').submit();
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
				$(this).fadeOut(300, function () {
					if ($(clickedButton).attr("id")=="bimp-help-trigger") {
						$("#bimp-help").fadeIn(300);
					}
					if ($(clickedButton).attr("id")=="bimp2-trigger") {
						$("#bimp2-help").fadeIn(300);
					}
					if ($(clickedButton).attr("id")=="bimpeditors-trigger") {
						$("#bimpeditors-help").fadeIn(300);
					}
					if ($(clickedButton).attr("id")=="ui-help-trigger") {
						$("#ui-help").fadeIn(300);
					}
				});
				return false;
			}	
		});
	});

	$("body").delegate("#backToEditData", "click", function() {
		$("#resultsPage").fadeOut("fast", function() {
			$(this).remove();
		});
		$("#uploadPage").fadeIn("fast");
		isResultsShown = false;
	});

	$("body").delegate(".close", "click", function () {
		closeLoadingModal();
	});
	
	$("body").delegate(".gatewayGroup,.startEvent,.task,.catchEvent", "focus", function() {
		var that = this;
		if ($(this).hasClass("gatewayGroup")) {
			$(this).find(".gateway").each(function(index, element){
				var sourceId = $(element).parent().attr("id");
				var source = $(bimp.parser.xmlFile).find(
						$(bimp.parser.xmlFile).find(
								"#" + $($(bimp.parser.xmlFile).find(
										'[targetRef=' + sourceId + ']')[0]).attr('sourceRef'))[0]).attr("id");
				var target = $(element).find(".targetRef").text();
				$("[data-id='" + source + "']").addClass("source");
				$("[data-id='" + target + "']").addClass("target");
				if ($("[data-id='" + target + "']").size() > 0 && $("[data-id='" + target + "']").is(":visible")) {
					$(that).addClass("focus");
					addTargetIndicators($("[data-id='" + target + "']").position().top, $(element).parent().position().top);
				}
				if ($("[data-id='" + source + "']").size() > 0 && $("[data-id='" + source + "']").is(":visible")) {
					$(that).addClass("focus");

					addSourceIndicators($("[data-id='" + source + "']").position().top, $(element).parent().position().top);
				}
			});
		} else {
			var id = $(this).attr("data-id");
			var source = $(bimp.parser.xmlFile).find(
					$(bimp.parser.xmlFile).find(
							"#" + $($(bimp.parser.xmlFile).find(
									'[targetRef=' + id + ']')[0]).attr('sourceRef'))[0]).attr("id");
			var target = $(bimp.parser.xmlFile).find(
					$(bimp.parser.xmlFile).find(
							"#" + $($(bimp.parser.xmlFile).find(
									'[sourceRef=' + id + ']')[0]).attr('targetRef'))[0]).attr("id");
			$("[data-id='" + source + "']").addClass("source");
			$("#" + source).addClass("source");
			$("[data-id='" + target + "']").addClass("target");
			$("#" + target).addClass("target");
			if ($("[data-id='" + target + "']").size() > 0 && $("[data-id='" + target + "']").is(":visible")) {
				$(that).addClass("focus");
				addTargetIndicators($("[data-id='" + target + "']").position().top, $(this).position().top);
			}
			if ($("[data-id='" + source + "']").size() > 0 && $("[data-id='" + source + "']").is(":visible")) {
				$(that).addClass("focus");
				addSourceIndicators($("[data-id='" + source + "']").position().top, $(this).position().top);
			}
			if ($("#" + target).size() > 0 && $("#" + target).is(":visible")) {
				$(that).addClass("focus");
				addTargetIndicators($("#" + target).position().top, $(this).position().top);
			}
			if ($("#" + source).size() > 0 && $("#" + source).is(":visible")) {
				$(that).addClass("focus");
				addSourceIndicators($("#" + source).position().top, $(this).position().top);
			}
		}
	});
	
	$("body").delegate(".gatewayGroup,.task,.startEvent,.catchEvent", "focusout", function() {
		$(this).removeClass("focus");
		$(".target").removeClass("target");
		$(".source").removeClass("source");
		$(".targetText").remove();
		$(".sourceText").remove();
		$(".targetIndicator").remove();
		$(".sourceIndicator").remove();
	});
	$("body").on("click", "#uploadNewFile", function (e) {
		e.preventDefault();
		window.location.reload();
		return false;
	});
});
// namespace the global functions and objects under bimp.util
var timeTableRow;

var showForm = function (delay) {
	$("body").trigger(bimp.testutil.config.startEvent, ["showForm"]);
	$("#instructions").hide();
	$("#upload-area").fadeOut(delay, function() {
		$("#data-input").fadeIn(delay, (function() {
			$("#startSimulationButton").fadeIn(delay);
			$("#logCheckBox").fadeIn(delay);
			$(".toggle-div :input[title]").tooltip({
				position: "top right",
				effect: "fade"
			});
			$(".toggle-div img[title]").tooltip({
				position: "top right",
				effect: "fade"
			});
		}));
	});
	$("body").trigger(bimp.testutil.config.endEvent, ["showForm"]);
};

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
		var curVal = $(this).val();
		
		$(this).find("option").remove();
		var that = this;
		if ($(that).parent().parent().hasClass("timetable")) {
			$(that).append($("<option></option>").attr("value", "*").text("*"));
		}
		$.each(bimp.parser.startEvent.resources, function(resourceName, resource) {
			$(that).append($("<option></option>").attr("value", resourceName).text(resource.name));
		});
		$(this).val(curVal);

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
			normal : "mean,stdev",
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
	$("body").trigger(bimp.testutil.config.startEvent, ["openLoadingModal"]);
	$("body").append("<div id='modal-bg'></div>");
	$("body").append("<div id='loading'>" +
			"<div class='close'><span>x</span></div>" +
			"<div class='top'><h2 class='title'>Running your simulation, please wait</h2></div>" +
			"<div class='status-wrap'><p><span class='status'>Status</span></p></div>" +
			"<div class='progressBarContainer'><div class='progressBar'></div></div>" +
			"<h2 class='progress'>Progress</h2>" +
			"</div>");
	var left = ($(document).width() - $("#loading").width()) / 2;
	$("#loading").css({"left":left});
	$("#modal-bg").css({"height":$(document).height()});
	$.ajax({
		contentType : 'application/json',
		type : 'get',
		url : '/simulate'
	});
	timerId = setInterval(function () {
		getStatus();
		}, interval);
	$("#modal-bg").fadeIn();
	$("#loading").fadeIn();
};

var closeLoadingModal = function () {
	$("#loading").fadeOut(function(){$(this).remove();});
	$("#modal-bg").fadeOut(function(){$(this).remove();});
};

getStatus = function() {
	//getting the status of the simulation
	timer += interval;
	$.ajax({
		contentType : 'application/json',
		type : 'get',
		url : '/getStatus',
		success : function(data) {
			switch (data.status) {
			case ("INITIALIZING"):
				if (pointCount < 4) {
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
				if (pointCount < 4) {
					$(".status").text(data.status + generateXCharacters(pointCount, "."));
					pointCount += 1;
				} else {
					pointCount = 0;
				}
				break;
			case ("FINALIZING"):
				$(".progressBarContainer").fadeOut();
				if (pointCount < 4) {
					$(".status").text(data.status + " and writing logs" + generateXCharacters(pointCount, "."));
					pointCount += 1;
				} else {
					pointCount = 0;
				}
				break;
			case ("FINISHED"):
				clearInterval(timerId);
				if (!isResultsShown) {
					$.ajax({
						type : 'get',
						url : '/getResults',
						success : function(data) {
							$("#uploadPage").fadeOut();
							closeLoadingModal();
							$("#header").after(data);
							$("body").trigger(bimp.testutil.config.endEvent, ["openLoadingModal"]);
							isResultsShown = true;
						}, 
						error: function (data) {
							clearInterval(timerId);
							data.error = "Unable to retrieve results";
							showLoadingError(data);
							isResultsShown = false;
						}
					});
				}
				break;
			case ("ERROR"):
				clearInterval(timerId);
				showLoadingError(data);
				break;
			}
		},
		error : function(data) {
			clearInterval(timerId);
			showLoadingError(data);
			throw data;
		}

	});
};

var showLoadingError = function (data) {
	$("#loading").addClass("error");
	$(".title").text("Simulation ended with an error, please revise your data.");
	$(".status").text("Error: " + (data.error ? data.error : "Unknown error"));
	$(".status-wrap").append("<a id='details' href='#'>Details</a>");
	$("body").off("click", "#details");
	$("body").on("click", "#details", function () {
		$("<div style='height: 200px; overflow-x: hidden; '></div>").html(data.stacktrace ? data.stacktrace : "No information found.").dialog({width: "500px", height: "400px", title: "Error details", buttons: { "Ok": function() { $(this).dialog("close"); } }, resizable: false }).css({height: "200px"});
		return false;
	});
	$(".close").show();
	throw new SimulationError("Simulation error: " +  (data.error ?  + data.error : "Unknown error") + "||"+ data.stacktrace, data.stacktrace);
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

var addTargetIndicators = function (targetTop, elementTop) {
	if ($(".targetText").size() > 0 ) {
		$(".targetText").text("Targets");
	} else {
		var targetText = jQuery('<span/>', {
			css: {
				position: "absolute",
				top: elementTop - 10,
				"margin-left": "-70px",
				"font-size": "11px"
			},
			text: "Target"
		});
		targetText.addClass("targetText");
		$("#uploadPage").append(targetText);
	}
	if (elementTop < targetTop) {
		var tmp = elementTop;
		elementTop = targetTop;
		targetTop = tmp;
	}
	var div = jQuery('<div/>', {  
	    css: {
	        position: "absolute",
	        top: targetTop-3 + "px",
	        height: elementTop-3 - targetTop + "px",
	        "border": "3px solid #666",
	        "border-right": "none",
	        "border-top-left-radius" : "30px",
	        "border-bottom-left-radius" : "30px",
	        width: "70px",
	        "margin-left": "-33px"
	        
	    }
	});
	$(div).addClass("targetIndicator");
	$("#uploadPage").append(div);
};
var addSourceIndicators = function (sourceTop, elementTop) {
	if ($(".sourceText").size() > 0 ) {
		$(".sourceText").text("Sources");
	} else {
		var sourceText = jQuery('<span/>', {
			css: {
				position: "absolute",
				top: elementTop - 10,
				"font-size": "11px",
				"margin-left": $("#uploadPage").width() + 35 + "px"
			},
			text: "Source"
		});
		sourceText.addClass("sourceText");
		$("#uploadPage").append(sourceText);
	}
	if (elementTop < sourceTop) {
		var tmp = elementTop;
		elementTop = sourceTop;
		sourceTop = tmp;
	}
	var div = jQuery('<div/>', {  
		css: {
			position: "absolute",
			top: sourceTop-3 + "px",
			height: elementTop-3 - sourceTop + "px",
			"border": "3px solid #666",
			"border-left": "none",
			"border-top-right-radius" : "30px",
			"border-bottom-right-radius" : "30px",
			width: "60px",
			"margin-left": $("#uploadPage").width() - 40 + "px"
				
		}
	});
	$(div).addClass("sourceIndicator");
	$("#uploadPage").append(div);
};

var generateXCharacters = function (x, character) {
	var result = "";
	for (var i = 0; i<x; i++) {
		result = result + character;
	}
	return result;
};

function loadLikeButton(d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) {
		return;
	}
	js = d.createElement(s);
	js.id = id;
	js.src = "//connect.facebook.net/en_GB/all.js#xfbml=1";
	fjs.parentNode.insertBefore(js, fjs);
};

function browserValidation() {
	var is_chrome = /chrome/.test( navigator.userAgent.toLowerCase() );
	var browser = $.browser;
	if (is_chrome) {

	} else if (browser.msie || browser.safari || (browser.mozilla && browser.version < 4) || (browser.opera && browser.version < 11 )) {
		$("body").prepend(
				'<div id="browser" class="gill-font">' +
				'<div id="browserWarning">It seems that your browser is not supported by our application</br>' +
				'We strongly recommend You to download the latest version of Mozilla Firefox or Google Chrome browsers</div>' +
				'<div id="browserIcons"><a href="http://www.mozilla.org/en-US/firefox/new/"><img src="./css/images/firefox.png" border="0"></a>' +
				'<a href="http://www.google.com/chrome"><img src="./css/images/chrome.png" border="0"></a></div>' +
				'</div>');
	}
}

var pointCount = 0,
	interval = 500,
	timerId = "",
	timer = 0,
	isResultsShown = false;

function SimulationError(message, stacktrace) {
	this.message = message;
	this.stacktrace = stacktrace;
}

SimulationError.prototype = new Error();
SimulationError.constructor = SimulationError;

function setStartTimeDefaults() {
	if (!$(".startAtDate").val() || !$(".startAtTime").val()) {
		var d = new Date(),
		dateString, timeString;
		dateString = d.getFullYear() + "-" + formatTime(d.getMonth() + 1) + "-" + formatTime(d.getDay());
		timeString = formatTime(d.getHours()) + ":" + formatTime(d.getMinutes()) + ":" + formatTime(d.getSeconds());
		$(".startAtDate").val(dateString);
		$(".startAtTime").val(timeString);
	}
}

function formatTime(input) {
	input = input.toString();
	if (input.length == 1) {
		input = "0" + input;
	}
	return input;
}

bimp.tools = {
		openError: function (message) {
			$("<div></div>").html(message).dialog({width : "300px", title: "Error!", buttons: { "Ok": function() { $(this).dialog("close"); } }, resizable: false });
		}
};