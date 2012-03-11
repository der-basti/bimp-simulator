bimp.testutil = bimp.testutil ? bimp.testutil : {
	
	config: {
		startedEvent: "action-started",
		endEvent: "action-ended",
		errorEvent: "error-event",
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
			bimp.file.readTextToDocument($("#testFile").val()); 
		});
		aq.add(function () {
			showForm(0);
		});
		bimp.testutil.watcher.start();
		aq.runNext();
	},
	executer: {
		start: function () {
			
		}
	},
	watcher: {
		stats: {},
		start: function () {
			var config = bimp.testutil.config;
			var watcher = bimp.testutil.watcher;
			console.log("registering events");
			$("body").on(config.startedEvent, function (e, data) {
				watcher.stats[data] = watcher.stats[data] ? watcher.stats[data] : {};
				watcher.stats[data].startDate = new Date();
				console.log("start of", data);
			});
			$("body").on(config.endEvent, function (e, data) {
				watcher.stats[data].endDate = new Date();
				watcher.stats[data].duration = (watcher.stats[data].endDate - watcher.stats[data].startDate) / 1000;
				console.log("end of", data, "duration:", watcher.stats[data].duration);
				config.actionQ.runNext();
			});
			$("body").on(config.errorEvent, function (e, data) {
				
			});
		}
		
	},
	reporter: {
		start: function () {
			
		}
	}
	
}