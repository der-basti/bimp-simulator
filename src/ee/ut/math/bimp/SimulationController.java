package ee.ut.math.bimp;

import java.io.IOException;
import java.io.PrintWriter;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.json.simple.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import ee.ut.bpsimulator.logger.KpiCalculator;
import ee.ut.bpsimulator.model.Activity;

/**
 * Simulation controller.
 * 
 * @author Marko
 * 
 */
@Controller
public class SimulationController {

	private static Logger log = Logger.getLogger(SimulationController.class);

	private HashMap<String, Simulation> simulations = new HashMap<String, Simulation>();

	/**
	 * Shows the status of the simulation, writes it out as JSON into the
	 * response.
	 */
	@RequestMapping(value = "/getStatus", method = RequestMethod.POST)
	public void getStatus(HttpServletResponse response,
			HttpServletRequest request) {

		String id = (String) request.getSession().getAttribute("id");
		Simulation simulation = simulations.get(id);
		SimulationChecker checker = simulation.getChecker();
		
		if((Boolean) request.getAttribute("logFile") ){
//			simulation.;C
		}

		response.setContentType("application/json");
		JSONObject json = new JSONObject();
		String status = checker.getStatus();
		if (status.equals(null)) {
			status = "RUNNING";
		}
		json.put("status", status);
		json.put("progress", checker.getProgress());

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
		if((Boolean) request.getAttribute("mxmlLog")) {
			//TODO:
		}
		simulation.start();
		simulations.put(id, simulation);
		model.addAttribute("id", id);
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

		String id = (String) request.getSession().getAttribute("id");
		Simulation simulation = simulations.get(id);
		SimulatorRunner runner = simulation.getRunner();

		model.setViewName("results");
		model.addObject("stats", runner.getKpiStats());

		DecimalFormat dec = new DecimalFormat("###.##");
		KpiCalculator kpi = runner.getKpiStats();

		List<Map<String, Object>> elements = new ArrayList<Map<String, Object>>();
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

			log.debug("Total cost: "
					+ dec.format(kpi.getElementTotalCost(activity)));

			activityMap.put("description", activity.getDescription());

			activityMap.put("avgCost", avgCost);

			activityMap.put("avgDuration", avgDuration);

			activityMap.put("avgIdle", avgIdle);

			activityMap.put("avgWaiting", avgWaiting);

			elements.add(activityMap);
		}
		model.addObject("elements", elements);

		return model;

	}
}
