package ee.ut.math.bimp;

import java.io.IOException;
import java.io.PrintWriter;
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

import ee.ut.bpsimulator.model.Activity;

/**
 * Simulation controller.
 * @author Marko
 *
 */
@Controller
public class SimulationController {
	
	private static Logger log = Logger.getLogger(SimulationController.class);
	private HashMap<String, Simulation> simulations = new HashMap<String, Simulation>();
	
	/**
	 * Shows the status of the simulation, writes it out as JSON into the response.
	 */
	@RequestMapping(value = "/getStatus", method = RequestMethod.POST)
	public void getStatus(HttpServletResponse response, HttpServletRequest request) {
		
		String id = (String) request.getSession().getAttribute("id");
		Simulation simulation = simulations.get(id);
		SimulationChecker checker = simulation.getChecker();
		
		response.setContentType("application/json");
		JSONObject json = new JSONObject();
		String status = checker.getStatus();
		if (status.equals(null)) {
			status = "RUNNING";
		}
		json.put("status", status);

		// TODO: tagastaks file name session id j2rgi kui finalized?

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
				.getRealPath("/tmp/"+ "in_" + id + ".bpmn");
		Simulation simulation = new Simulation(path);
		simulation.start();
		simulations.put(id, simulation);
		model.addAttribute("id", id);
		return "loading";
	}
	
	/**
	 * Shows results.
	 * 
	 * @return View "results", kpiCalculator object and all activities' data
	 */
	@RequestMapping(value = "/getResults", method = RequestMethod.GET)
	public ModelAndView getResults(ModelAndView model, HttpServletRequest request) {
		
		String id = (String) request.getSession().getAttribute("id");
		Simulation simulation = simulations.get(id);
		SimulatorRunner runner = simulation.getRunner();
		
		model.setViewName("results");
		model.addObject("stats", runner.getKpiStats());

		List<Map<String, Object>> elements = new ArrayList<Map<String, Object>>();
		for (Activity activity : runner.getKpiStats().getAllElements()) {
			Map<String, Object> activityMap = new HashMap<String, Object>();
			int count = runner.getKpiStats().getElementCount(activity);
			activityMap.put("description", activity.getDescription());
			activityMap.put("totalCost", runner.getKpiStats()
					.getElementTotalCost(activity) / count);
			activityMap.put("totalDuration", runner.getKpiStats()
					.getElementTotalDuration(activity) / count);
			activityMap.put("totalIdle", runner.getKpiStats()
					.getElementTotalIdleTime(activity) / count);
			if (runner.getKpiStats().getElementTotalWaitingTime(activity) != null) {
				activityMap.put("totalWaiting", runner.getKpiStats()
						.getElementTotalWaitingTime(activity) / count);
			} else {
				activityMap.put("totalWaiting", "n/a");
			}

			elements.add(activityMap);
		}
		model.addObject("elements", elements);
		simulations.remove(id);
		return model;

	}

}
