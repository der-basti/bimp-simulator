bimp.testutil = bimp.testutil ? bimp.testutil : {
	timeoutChecker: "",
	config: {
		startEvent: "action-started",
		endEvent: "action-ended",
		errorEvent: "error-event",
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
		}
	},
	init: function () {
		// 
		console.log("initialising testutil");
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
			false;
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
				watcher.stats[data].startDate = new Date();
				console.log("start of", data);
			});
			$("body").on(config.endEvent, function (e, data) {
				watcher.stats[data].endDate = new Date();
				watcher.stats[data].duration = (watcher.stats[data].endDate - watcher.stats[data].startDate) / 1000;
				console.log("end of", data, "duration:", watcher.stats[data].duration);
				if (data == "openLoadingModal") {
					clearInterval(bimp.testutil.timeoutChecker);
				}
				config.actionQ.runNext();
			});
			$("body").on(config.errorEvent, function (e, data) {
				var watcher = bimp.testutil.watcher;
				console.log("got error in", data["name"], "saying that", data["cause"].toString(), "at", data["cause"].stack);
				watcher.stats[data["name"]] = watcher.stats[data["name"]] ? watcher.stats[data["name"]] : {};
				watcher.stats[data["name"]].error = {
						type: data["cause"].toString(),
						stack: data["cause"].stack
				}
			});
		}
		
	},
	reporter: {
		start: function () {
			
		}
	}
}