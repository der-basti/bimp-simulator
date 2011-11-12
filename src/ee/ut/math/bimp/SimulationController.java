package ee.ut.math.bimp;

import java.io.IOException;
import java.io.PrintWriter;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.json.simple.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import com.google.gson.Gson;

import ee.ut.bpsimulator.logger.KpiCalculator;
import ee.ut.bpsimulator.logger.MxmlLogger;
import ee.ut.bpsimulator.model.Activity;
import ee.ut.bpsimulator.model.Resource;

/**
 * Simulation controller.
 * 
 * @author Marko, Viljar
 * 
 */
@Controller
public class SimulationController {

	private static Logger log = Logger.getLogger(SimulationController.class);

	private HashMap<String, Simulation> simulations = new HashMap<String, Simulation>();

	List<Map<String, Object>> elements;

	/**
	 * Shows the status of the simulation, writes it out as JSON into the
	 * response.
	 */
	@RequestMapping(value = "/getStatus", method = RequestMethod.POST)
	public void getStatus(HttpServletResponse response,
			HttpServletRequest request) {

		JSONObject json = new JSONObject();
		String id = (String) request.getSession().getAttribute("id");
		Simulation simulation = simulations.get(id);
		if (simulation != null) {
			SimulationChecker checker = simulation.getChecker();
	
			response.setContentType("application/json");
			String status = "";
			if (simulation.getException() == null) {
				status = checker.getStatus();
			} else {
				status = "ERROR";
				json.put("error", simulation.getException().getMessage());
			}
			if (status.equals(null)) {
				status = "RUNNING";
			}
			json.put("status", status);
			json.put("progress", checker.getProgress());
		} else {
			json.put("status", "N/A");
			json.put("progress", "N/A");
		}
		try {
			PrintWriter writer = response.getWriter();
			writer.print(json.toString());
			writer.close();
		} catch (IOException e) {
			e.printStackTrace();
		}

	}

	/**
	 * Starts the simulation and the simulation checker.
	 * 
	 * @return Loading view
	 */
	@RequestMapping(value = "/simulate", method = RequestMethod.GET)
	public String simulate(ModelMap model, HttpServletRequest request) {
		String id = (String) request.getSession().getAttribute("id");
		String path = request.getSession().getServletContext()
				.getRealPath("/tmp/" + "in_" + id + ".bpmn");

		Simulation simulation = new Simulation(path);

		if (Boolean.valueOf((String) request.getSession().getAttribute(
				"mxmlLog"))) {
			simulation.getRunner().setMxmlLog(new MxmlLogger(path));
		}

		model.addAttribute("id", id);
		simulations.put(id, simulation);
		try {
			simulation.start();
		} catch (Exception e) {
			simulation.setException(e);
			log.debug("Simulation failed", e);
			e.printStackTrace();
		}
		return "loading";
	}

	/**
	 * Shows results.
	 * 
	 * @return View "results", KpiCalculator object, all activities' data
	 */
	@RequestMapping(value = "/getResults", method = RequestMethod.GET)
	public ModelAndView getResults(ModelAndView model,
			HttpServletRequest request) {
		HttpSession session = request.getSession();
		String id = (String) request.getSession().getAttribute("id");
		Simulation simulation = simulations.get(id);
		SimulatorRunner runner = simulation.getRunner();

		model.setViewName("results");
		model.addObject("stats", runner.getKpiStats());

		DecimalFormatSymbols otherSymbols = new DecimalFormatSymbols();
		otherSymbols.setDecimalSeparator('.');
		otherSymbols.setGroupingSeparator(' '); 
		
		DecimalFormat dec = new DecimalFormat("###.##", otherSymbols);
		KpiCalculator kpi = runner.getKpiStats();

		elements = new ArrayList<Map<String, Object>>();
		for (Activity activity : kpi.getAllElements()) {
			Map<String, Object> activityMap = new HashMap<String, Object>();
			int count = kpi.getElementCount(activity);

			String avgDuration = dec.format(kpi
					.getElementTotalDuration(activity) / count);

			String avgIdle = kpi.getElementTotalIdleTime(activity) != 0 ? dec
					.format(kpi.getElementTotalIdleTime(activity) / count)
					: "n/a";

			String avgWaiting = (kpi.getElementTotalWaitingTime(activity)) != null
					&& (kpi.getElementTotalWaitingTime(activity) > 0) ? dec
					.format(kpi.getElementTotalWaitingTime(activity) / count)
					: "n/a";

			String avgCost = (kpi.getElementTotalCost(activity) / count) != 0 ? dec
					.format(kpi.getElementTotalCost(activity) / count) : "n/a";

			// log.debug("Total cost: "
			// + dec.format(kpi.getElementTotalCost(activity)));

			activityMap.put("description", activity.getDescription());

			activityMap.put("avgCost", avgCost);

			activityMap.put("avgDuration", avgDuration);

			activityMap.put("avgIdle", avgIdle);

			activityMap.put("avgWaiting", avgWaiting);

			elements.add(activityMap);
			
		}

		Object[] resources = runner.sim.getResourceManager().getDefinedResources().toArray();
		double[] utilization = new double[resources.length];
		String[] resourcesStr = new String[resources.length];
		for (int i=0; i<resources.length; i++) {
			utilization[i] = (int) (kpi.getResourceUtilization((Resource) resources[i])*100);
			resourcesStr[i] = resources[i].toString().split("id")[0].split("Resource ")[1];
		}
		
		List<String[]> chartIntervals = new ArrayList<String[]>();
		List<int[]> chartCounts = new ArrayList<int[]>();
		
		getHistogramValues(kpi.getProcessDurations(), chartIntervals, chartCounts, false);
		getHistogramValues(kpi.getProcessWaitingTimes(), chartIntervals, chartCounts, false);
		getHistogramValues(kpi.getProcessCosts(), chartIntervals, chartCounts, true);
		
		Gson gsonObject = new Gson();
		
		model.addObject("elements", elements);
		
		model.addObject("durationIntervals", gsonObject.toJson(chartIntervals.get(0)));
		model.addObject("waitingTimeIntervals", gsonObject.toJson(chartIntervals.get(1)));
		model.addObject("costIntervals", gsonObject.toJson(chartIntervals.get(2)));
		
		model.addObject("durationCounts", gsonObject.toJson(chartCounts.get(0)));
		model.addObject("waitingTimeCounts", gsonObject.toJson(chartCounts.get(1)));
		model.addObject("costCounts", gsonObject.toJson(chartCounts.get(2)));
		
		model.addObject("resources", gsonObject.toJson(resourcesStr));
		model.addObject("utilization", gsonObject.toJson(utilization));
		
		model.addObject("enableLogDownload",
				Boolean.valueOf((String) session.getAttribute("mxmlLog")));
//		simulations.remove(id);
		return model;

	}

	private void getHistogramValues(double[] array, List<String[]> intervalList, List<int[]> countList, boolean isCostChart) {
		
		double max = array[0];
		double min = array[0];
		for (int i=0; i<array.length; i++) {
			if (array[i] < 0) {
				array[i] = 0; 
			}
			if (array[i] > max) {
				max = array[i];
			}
			if (array[i] < min) {
				min = array[i];
			}
		}
		
		int divisor;
		String unit;
		
		if (isCostChart) {
			divisor = 1;
			unit = "";
		}
		
		else if (max >= 432000) {
			divisor = 86400;
			unit = " days";
		}
		else if (max >= 18000) {
			divisor = 3600;
			unit = " h";
		}
		else if (max >= 300) {
			divisor = 60;
			unit = " min";
		}
		else {
			divisor = 1;
			unit = " s";
		}
		
		double difference = (max-min)/divisor;
		if (difference == 0) {
			intervalList.add(null);
			countList.add(null);
			return;
		}
		String differenceStr = Long.toString((long) difference);
		char first = differenceStr.charAt(0);
		int powerOfTen = differenceStr.length()-1;
		int interval;
		
		if (first < '5') { 
			powerOfTen -= 1;
			interval = (int) (5*(Math.pow(10, powerOfTen)));
		}
		else {
			interval = (int) (Math.pow(10, powerOfTen));
		}

		int intervalAmount = (int) Math.ceil(difference/interval);
		
		
		int[] counts = new int[intervalAmount];
		String[] intervals = new String[intervalAmount];
		int lowest = ((int)(min/divisor/interval))*interval;
		
		for (int i=0; i<intervalAmount; i++) {
			intervals[i] = Integer.toString((int)((lowest + i*interval))) + " - " 
			+ Integer.toString((int)((lowest + (i+1)*interval))) + unit;
		}

		for (double value : array) {
			int i = (int) ((value-min)/divisor/interval);
			counts[i] += 1;
		}
		
		intervalList.add(intervals);
		countList.add(counts);
	}

	/**
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/getCsv", method = RequestMethod.POST)
	public void getCSV(HttpServletRequest request, HttpServletResponse response) {

		String fileName = (String) request.getSession()
				.getAttribute("fileName");
		String id = (String) request.getSession().getAttribute("id");

		Simulation simulation = simulations.get(id);
		SimulatorRunner runner = simulation.getRunner();
		runner.getKpiStats();
		KpiCalculator kpi = runner.getKpiStats();

		// String path = request.getSession().getServletContext()
		// .getRealPath("/tmp/" + fileName + ".csv");

		response.setContentType("text/csv");
		response.addHeader("Content-Disposition", "attachment; filename="
				+ fileName + ".csv");

		PrintWriter writer;
		try {
			writer = response.getWriter();

			writer.append("Completed elements");
			writer.append(',');
			writer.append("Completed process instances");
			writer.append(',');
			writer.append("Maximum process cost");
			writer.append(',');
			writer.append("Maximum process duration");
			writer.append(',');
			writer.append("Minimum process cost");
			writer.append(',');
			writer.append("Minimum process duration");
			writer.append(',');
			writer.append("Total cost");
			writer.append(',');
			writer.append("Total duration");
			writer.append('\n');

			writer.append(String.valueOf(kpi.getCompletedElements()));
			writer.append(',');
			writer.append(String.valueOf(kpi.getCompletedProcesseInstances()));
			writer.append(',');
			writer.append(String.valueOf(kpi.getMaxProcessCost()));
			writer.append(',');
			writer.append(String.valueOf(kpi.getMaxProcessDuration()));
			writer.append(',');
			writer.append(String.valueOf(kpi.getMinProcessCost()));
			writer.append(',');
			writer.append(String.valueOf(kpi.getMinProcessDuration()));
			writer.append(',');
			writer.append(String.valueOf(kpi.getTotalCost()));
			writer.append(',');
			writer.append(String.valueOf(kpi.getTotalDuration()));
			writer.append('\n');

			writer.append('\n');

			writer.append("Description");
			writer.append(',');
			writer.append("Average cost");
			writer.append(',');
			writer.append("Average duration");
			writer.append(',');
			writer.append("Average Idle Time");
			writer.append(',');
			writer.append("Average Waiting Time");
			writer.append('\n');

			for (Map<String, Object> map : elements) {
				writer.append(String.valueOf(map.get("description")));
				writer.append(',');
				writer.append(String.valueOf(map.get("avgCost")));
				writer.append(',');
				writer.append(String.valueOf(map.get("avgDuration")));
				writer.append(',');
				writer.append(String.valueOf(map.get("avgIdle")));
				writer.append(',');
				writer.append(String.valueOf(map.get("avgWaiting")));
				writer.append('\n');
			}

		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
