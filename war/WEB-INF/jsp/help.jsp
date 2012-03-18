<%@ page language="java" contentType="text/html; charset=UTF8"
	pageEncoding="UTF8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF8">
<link rel="stylesheet" type="text/css" href="./css/style.css"></link>
<link href='http://fonts.googleapis.com/css?family=Open+Sans:300' rel='stylesheet' type='text/css'>
<script type="text/javascript" src="./js/jquery-1.7.1.min.js"></script>
<script type="text/javascript" src="./js/jquery-ui-1.8.18.custom.min.js"></script>
<script type="text/javascript" src="./js/javascript.js"></script>
<script type="text/javascript" src="https://apis.google.com/js/plusone.js"></script>


<title>BIMP Simulator</title>
</head>
<body>
	<div id="main">
	<jsp:include page="_header.jsp"></jsp:include>
	<div id="helpPage" class="contents gill-font justified inline">
		<div id="help-nav">
			<div class="help-nav-button" id="bimp-help-trigger">BIMP Simulator</div>
			<div class="help-nav-button" id="bimp2-trigger">BPMN 2.0</div>
			<div class="help-nav-button" id="bimpeditors-trigger">BPMN 2.0 Editors</div>
			<div class="help-nav-button" id="ui-help-trigger">User Interface</div>
		</div>
		<div id="help-text-div">
			<div class="help-text" id="bimp-help">
			<H1>BIMP SIMULATOR</H1>
			<p><b>A business process</b> is a collection of related, structured activities or tasks that produce a specific 
			service or product. In general it can be said that business processes exist in all companies that serve 
			a particular goal, but very often those are not written down or defined formally.</p>
			<p>A goal of business analysts is to make such process as efficient as possible in order to 
			gain higher customer 
			satisfaction, product or service quality, delivery and time-to-market speed. This kind of goal can be 
			achieved using a systematic approach called business process management (henceforth BPM for short). 
			Many commercial state of the art business process modeling tools incorporate a simulation component. 
			However, these process simulators are often slow, cannot simulate complex real-life business processes 
			and sometimes cannot even deal with large-scale simulations. The simulator is designed and implemented 
			from scratch in the Java programming language and it will support the simulation of business process 
			models defined in the BPMN 2.0 standard.</p>
			</div>
			<div class="help-text" id="bimp2-help">
			<H1>BPMN 2.0</H1>
			<p>BPMN 2.0 does not specify how simulation related information has to be serialized, be-cause the 
			simulation is considered to be outside the scope of BPMN. Although some attempts have been made 
			like up to now to overcome this problem, but at the moment there is no standard way of representing 
			simulation information in BPMN. In order to simulate a business process model additional simulation 
			information has to be provided for:</p>
			
			<ol>
				<li>Process instance initialization</li>
				<li>Element execution</li>
				<li>Resource allocation</li>
				<li>Cost of activities</li>
				<li>Branching probabilities</li>
			</ol>
			
			<p>Process instance initialization data must contain the number of instances of the cases to create and 
			the information about the arrival rate which defines the time interval of when the next instance 
			started after the previous one. The process initialization data must contain information about which 
			and how many resources (actors or roles for tasks) are available for the process instances defined 
			in the model.</p>
			<p>Element execution data has to be associated with all elements which last for some 
			specified time and it must define how many time units it takes to complete the element in average.</p>
			<p>Resource allocation data has to be associated also with each task and it must define which resource 
			is responsible for and performs the task. Resource management is one of the key elements in the 
			simulation – a task cannot be started if all resources are in use which results in a queue of waiting 
			activities.</p>
			<p>Cost of activity is a monetary value of how much does it cost to perform an activity. 
			Usually the cost of activity includes the cost related to the duration (e.g. the hourly wage for 
			human resources) and additional costs (e.g. the shipping cost, road usage fees) that are fixed.</p>
			<p>Branching probabilities must be defined for the outgoing flows from the Xor- and Or-split gateways 
			in the process model. Using the branching probability information, the simulator determines which 
			path(s) will be taken in a particular process instance. In the real world task execution times and 
			process arrival rates in the most cases are not fixed values, but those can be defined by an average 
			value and some distribution info. Besides the fixed amount of time units there are three commonly 
			used distributions to describe a variety of time values: standard, uniform and exponential 
			distribution.</p>
			</div>
			<div class="help-text" id="bimpeditors-help">
			<H1>BPMN 2.0 EDITORS</H1>
			<p>For using the BPMN Simulator, You need a BPMN 2.0 file. For generating this file, You can use some 
			of the following editors:</p>
			<h2>ORYX</h2>
			<p>Oryx is a web-based process modeling environment. It is not only a great tool to model processes and 
			share them on the web but it also provides a platform for research prototypes. For more information, 
			click <a href="http://bpt.hpi.uni-potsdam.de/Oryx/WebHome">HERE</a>.</p>
			<h2>SIGNAVIO</h2>
			<p>The Signavio Process Editor provides easy access to professional business process management thanks
			to new web technology. It allows to incorporate more employees or business partners, suppliers and 
			customers into the process of process design. For more detailed information, see  
			<a href="http://www.signavio.com/en/bpmn">HERE</a>.</p>
			<h2>BIZAGI</h2>
			<p>Bizagi is a BPM Solution that will enable you and your organization to model, automate, execute and 
			improve your business processes through a graphic environment and without the need of programming. 
			Their webpage is <a href="http://www.bizagi.com/">HERE</a>.</p>
			</div>
			<div class="help-text" id="ui-help">
			<H1>USER INTERFACE</H1>
			<p>For using this Lightning Fast Business Process Simulator You have to go to the file upload page and 
			upload a BPMN file. For this, You can choose a file from Your computer by clicking on „Choose file“ 
			button or by dropping it on the dropping area.</p>
			<p>After choosing a file „Continue“-button appears and after pressing on it, You can change 
			or delete the simulation information from the file or add 
			additional information. For starting the simulation, You have to press on the „Start simulation“ 
			button. If You want to get the simulation log file, You have to click on the „Generate a log“ 
			checkbox. This has to be done before starting the simulation.</p>
			<p>After the simulation process, the system 
			displays all the generated information. For downloading the log file, BPMN file or simulation report, 
			press on the appropriate button displayed on the right side of the page and the selected file will 
			be downloaded to Your computer.</p> 
			</div>
		</div>
	</div>
	<jsp:include page="_footer.jsp"></jsp:include>	
	</div>
</body>
</html>