
  // Load the Visualization API and the piechart package.
      google.load('visualization', '1.0', {'packages':['corechart']});
      // draws it.
      function drawDurationsChart() {
	
	if (!durationIntervals || !durationCounts || durationIntervals == "" || durationCounts == "") {
	  return false;
	} else {

      
      //var durationIntervals = [1, 2, 3, 4];
      //var durationCounts = [1, 2, 3, 4];

      // Create the data table.
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Interval');
      data.addColumn('number', 'Count');
      data.addRows(durationIntervals.length);
      for (var j = 0; j < durationIntervals.length; j++) {    
        data.setValue(j, 0, durationIntervals[j]);
        data.setValue(j, 1, durationCounts[j]);    
      }

      // Set chart options
      var options = {'title':'Process durations',
                     'height':250,
                     'width':500,
		      'legend':'none',
		      'hAxis.textStyle': {
			  fontSize:10},
		      'hAxis.slantedText':false,
		      'vAxis.title':'# of processes',
		      'chartArea.left':1,
		      'chartArea.top':1,
		      'colors':['#4ABEC8','#4ABEC8'],
		      'titleTextStyle':{
			  color:'#5f5851'
		      }
		    };

      // Instantiate and draw our chart, passing in some options.
      var chart = new google.visualization.BarChart(document.getElementById('duration-chart-div'));
      chart.draw(data, options);
    }
      }
function drawWaitingTimesChart() {
	
	if (!waitingTimeIntervals || !waitingTimeCounts || waitingTimeIntervals == "" || waitingTimeCounts == "") {
	  return false;
	} else {

      
      //var durationIntervals = [1, 2, 3, 4];
      //var durationCounts = [1, 2, 3, 4];

      // Create the data table.
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Interval');
      data.addColumn('number', 'Count');
      data.addRows(waitingTimeIntervals.length);
      for (var j = 0; j < waitingTimeIntervals.length; j++) {    
        data.setValue(j, 0, waitingTimeIntervals[j]);
        data.setValue(j, 1, waitingTimeCounts[j]);    
      }

      // Set chart options
      var options = {'title':'Process waiting times',
                     'height':250,
                     'width':500,
		      'legend':'none',
		      'hAxis.textStyle': {
			  fontSize:10},
		      'hAxis.slantedText':false,
		      'vAxis.title':'# of processes',
		      'chartArea.left':1,
		      'chartArea.top':1,
		      'colors':['#4ABEC8','#4ABEC8'],
		      'titleTextStyle':{
			  color:'#5f5851'
		      }
		    };

      // Instantiate and draw our chart, passing in some options.
      var chart = new google.visualization.BarChart(document.getElementById('waiting-time-chart-div'));
      chart.draw(data, options);
    }
}

function drawCostsChart() {
	
	if (!costIntervals || !costCounts || costIntervals == "" || costIntervals == "") {
	  return false;
	} else {
      //var durationIntervals = [1, 2, 3, 4];
      //var durationCounts = [1, 2, 3, 4];

      // Create the data table.
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Interval');
      data.addColumn('number', 'Count');
      data.addRows(costIntervals.length);
      for (var j = 0; j < costIntervals.length; j++) {    
        data.setValue(j, 0, costIntervals[j]);
        data.setValue(j, 1, costCounts[j]);    
      }

      // Set chart options
      var options = {'title':'Process costs',
                     'height':250,
                     'width':500,
		      'legend':'none',
		      'hAxis.textStyle': {
			  fontSize:10},
		      'hAxis.slantedText':false,
		      'vAxis.title':'# of processes',
		      'chartArea.left':1,
		      'chartArea.top':1,
		      'colors':['#4ABEC8','#4ABEC8'],
		      'titleTextStyle':{
			  color:'#5f5851'
		      }
		    };

      // Instantiate and draw our chart, passing in some options.
      var chart = new google.visualization.BarChart(document.getElementById('cost-chart-div'));
      chart.draw(data, options);
    }
}
function drawResourcesChart() {
	
	if (!resources || !utilization || resources == "" || utilization == "") {
	  return false;
	} else {
		
      //var durationIntervals = [1, 2, 3, 4];
      //var durationCounts = [1, 2, 3, 4];

      // Create the data table.
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Resource');
      data.addColumn('number', 'Time occupied');
      data.addRows(resources.length);
      for (var j = 0; j < resources.length; j++) {    
        data.setValue(j, 0, resources[j]);
        data.setValue(j, 1, utilization[j]);    
      }

      // Set chart options
      var options = {'title':'Resource utilization',
                     'height':250,
                     'width':500,
		      'legend':'none',
		      'hAxis.textStyle': {
			  fontSize:10},
		      'hAxis.slantedText':false,
		      'vAxis.title':'# of processes',
		      'chartArea.left':1,
		      'chartArea.top':1,
		      'colors':['#4ABEC8','#4ABEC8'],
		      'titleTextStyle':{
			  color:'#5f5851'
		      }
		    };

      // Instantiate and draw our chart, passing in some options.
      var chart = new google.visualization.ColumnChart(document.getElementById('resources-chart-div'));
      chart.draw(data, options);
    }
}