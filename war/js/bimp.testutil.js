bimp.testutil = bimp.testutil ? bimp.testutil : {
	timeoutChecker: "",
	config: {
		startEvent: "action-started",
		endEvent: "action-ended",
		errorEvent: "error-event",
		finishEvent: "finis-event",
		simulationTimeout: 30,
		actionQ: {
			actions: [],
			add: function (fn) {
				bimp.testutil.config.actionQ.actions.push(fn);
			},
			runNext: function () {
				if (bimp.testutil.config.actionQ.actions.length) {
					var toRun = bimp.testutil.config.actionQ.actions[0];
					bimp.testutil.config.actionQ.actions = bimp.testutil.config.actionQ.actions.slice(1);
					toRun();
				}
			}
		},
		fileName: "",
		fileNr: "",
		filesTotal: ""
	},
	init: function () {
		// 
		bimp.testutil.config.fileName = $("#fileName").val();
		bimp.testutil.config.fileNr = parseInt($("#fileNr").val(), 10);
		bimp.testutil.config.filesTotal = parseInt($("#filesTotal").val(), 10);
		console.log("initialising testutil");
		console.log(bimp.testutil.config.fileNr, "/", bimp.testutil.config.filesTotal);
		var aq = bimp.testutil.config.actionQ;
		aq.add(function () {
			try {
				bimp.file.readTextToDocument($("#testFile").val()); 
			} catch (e) {
				$("body").trigger(bimp.testutil.config.errorEvent, {name: "readTextToDocument", cause: e});
			}
		});
		aq.add(function () {
			try {
				bimp.parser.init();
				bimp.parser.readStartEvent();
			} catch (e) {
				$("body").trigger(bimp.testutil.config.errorEvent, {name: "readStartEvent", cause: e});
			}
		});
		aq.add(function () {
			try {
				bimp.parser.readTasks();
			} catch (e) {
				$("body").trigger(bimp.testutil.config.errorEvent, {name: "readTasks", cause: e});
			}
		});
		aq.add(function () {
			try {
				bimp.parser.readIntermediateCatchEvents();
			} catch (e) {
				$("body").trigger(bimp.testutil.config.errorEvent, {name: "readIntermediateCatchEvents", cause: e});
			}
		});
		aq.add(function () {
			try {
				bimp.parser.readConditionExpressions();
			} catch (e) {
				$("body").trigger(bimp.testutil.config.errorEvent, {name: "readConditionExpressions", cause: e});
			}
		});
		aq.add(function () {
			try {
				$("body").trigger(bimp.testutil.config.startEvent, ["generateForm"]);
				bimp.forms.generate.start();
				updateAllTypeSelections();
				preloadTaskResources();
				$("body").trigger(bimp.testutil.config.endEvent, ["generateForm"]);
			} catch (e) {
				$("body").trigger(bimp.testutil.config.errorEvent, {name: "generateForm", cause: e});
			}
		});
		aq.add(function () {
			try {
				showForm(0);
			} catch (e) {
				$("body").trigger(bimp.testutil.config.errorEvent, {name: "showForm", cause: e});
			}
		});
		
		aq.add(function () {
			try {
				autoFillFields();
				if (!validateForm()) {
					$("body").trigger(bimp.testutil.config.errorEvent, {name: "validateForm", cause: new Error("Form not valid")});
				} else {
					aq.runNext();
				}
			} catch (e) {
				$("body").trigger(bimp.testutil.config.errorEvent, {name: "validateForm", cause: e});
			}
		});
		aq.add(function () {
			try {
				bimp.forms.read.start();
			} catch (e) {
				$("body").trigger(bimp.testutil.config.errorEvent, {name: "readForm", cause: e});
			}
		});
		aq.add(function () {
			try {
				bimp.file.updateFile();
			} catch (e) {
				$("body").trigger(bimp.testutil.config.errorEvent, {name: "updateFile", cause: e});
			}
		});
		aq.add(function () {
			try {
				var startDate = new Date();
				bimp.testutil.timeoutChecker = setInterval (function () {
					var hasTimedOut = bimp.testutil.hasTimedOut(startDate, bimp.testutil.config.simulationTimeout);
					if (hasTimedOut) {
						clearInterval(bimp.testutil.timeoutChecker);
						$("body").trigger(bimp.testutil.config.errorEvent, {name: "openLoadingModal", cause: new Error("Simulation has timed out")});
					}
				}, 1000);
				//handling the error thrown in the setInterval
				$(window).error(function (e) {
					clearInterval(bimp.testutil.timeoutChecker);
					// since we catch a bit different error, lets try to extract some useful information from it
					var er = e.originalEvent;
					var data = {};
					if (er) {
						data.toString = function () {
							return er.message; 
						};
						data.stack = er.filename + ": " + er.lineno;
						data.errorcode = 2; // simulation error
					}
					$("body").trigger(bimp.testutil.config.errorEvent, {name: "openLoadingModal", cause: data});
				});
				bimp.file.uploadFile();
				
			} catch (e) {
				clearInterval(bimp.testutil.timeoutChecker);
				$("body").trigger(bimp.testutil.config.errorEvent, {name: "openLoadingModal", cause: e});
			}
		});
		
		bimp.testutil.watcher.start();
		aq.runNext();
	},
	hasTimedOut: function (date, timeout) {
		console.log("checking for timeout");
		var curDate = new Date();
		if (timeout <= (curDate - date) / 1000) {
			return true;
		} else {
			return false;
		}
	},
	watcher: {
		stats: {},
		start: function () {
			var config = bimp.testutil.config;
			var watcher = bimp.testutil.watcher;
			console.log("registering events");
			$("body").on(config.startEvent, function (e, data) {
				watcher.stats[data] = watcher.stats[data] ? watcher.stats[data] : {};
				watcher.stats[data].name = data;
				watcher.stats[data].startDate = new Date().getTime();
			});
			$("body").on(config.endEvent, function (e, data) {
				watcher.stats[data].endDate = new Date().getTime();
				watcher.stats[data].duration = (watcher.stats[data].endDate - watcher.stats[data].startDate) / 1000;
				watcher.stats[data].errorCode = 0;
				console.log("end of", data, "duration:", watcher.stats[data].duration);
				if (data == "openLoadingModal") {
					clearInterval(bimp.testutil.timeoutChecker);
					$("body").trigger(bimp.testutil.config.finishEvent, {status: "Simulation finished!"});
				}
				config.actionQ.runNext();
			});
			$("body").on(config.errorEvent, function (e, data) {
				var watcher = bimp.testutil.watcher;
				console.log("got error in", data["name"], "saying that", data["cause"].toString(), "at", data["cause"].stack);
				watcher.stats[data["name"]] = watcher.stats[data["name"]] ? watcher.stats[data["name"]] : {};
//				watcher.stats[data["name"]].error = {
//						type: data["cause"].toString(),
//						stack: data["cause"].stack
//				};
				watcher.stats[data["name"]].errorCode = data["cause"].errorcode ? data["cause"].errorcode : 1;
				var simStack = data["cause"].toString().split("||")[1] ? " caused by => " + data["cause"].toString().split("||")[1] : "";
				watcher.stats[data["name"]].errorMessage = escapeHtml(data["cause"].toString().split("||")[0]); 
				watcher.stats[data["name"]].stackTrace = escapeHtml(data["cause"].stack + simStack);
				$("body").trigger(bimp.testutil.config.finishEvent, {status: "Simulation ended with error!"});
			});
			$("body").on(config.finishEvent, function (e, data) {
				console.log("got finishevent with status message:", data.status);
				bimp.testutil.reporter.start();
			});
		}
		
	},
	reporter: {
		start: function () {
			var stats = bimp.testutil.watcher.stats;
			var array = [];
			$.each(stats, function (element, value) {
				array.push(value);
			});
			bimp.testutil.reporter.sendData(JSON.stringify(array));
			
		},
		sendData: function (data) {
			console.log("sending data");
			$.ajax({
				type: "POST",
				url: "/runtestfiles",
				data: {
					simulationData: data
				},
				success: function (e) {
					console.log("data sent");
					// now continue with new file or finish up the testing.
					console.log(bimp.testutil.config.fileNr, bimp.testutil.config.filesTotal);
					if (bimp.testutil.config.fileNr < bimp.testutil.config.filesTotal) {
						window.location = "/runtestfiles?action=getfile&filenr=" + bimp.testutil.config.fileNr;
					} else {
						window.location = "/runtestfiles?action=finished";
					}
				},
				error: function (e) {
					console.log("unable to send data");
				}
			});
		}
	}
};

function autoFillFields() {
	$(".instances").val("1000");
	$(".resources .amount").val("5");
}

function escapeHtml(html) {
	return $('<div></div').text(html).html();
}