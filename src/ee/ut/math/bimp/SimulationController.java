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

	public SimulatorRunner runner;

	public SimulationChecker checker;
	
	public void init() {
		runner = new SimulatorRunner();
//		checker = new SimulationChecker();
	}
	
	/**
	 * Shows the status of the simulation, writes it out as JSON into the response.
	 */
	@RequestMapping(value = "/getStatus", method = RequestMethod.POST)
	public void getStatus(HttpServletResponse response) {

		response.setContentType("application/json");
		JSONObject json = new JSONObject();
		String status = checker.getStatus();
		if (status.equals(null)) {
			status = "RUNNING";
		}
		json.put("status", status);

		// TODO: tagastaks file name session id järgi kui finalized?

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
		init();
		String path = request.getSession().getServletContext()
				.getRealPath("/samples/")
				+ "\\12895InsuranceClaimHandlingTimeTable.bpmn";

		// TODO: kas kysida sessioonist?
		// runner = new SimulatorRunner();

		runner.init(path);
		checker = new SimulationChecker(path, runner.getSim(),
				runner.getKpiStats(), null);

		runner.start();

		return "loading";
	}
	
	/**
	 * Shows results.
	 * 
	 * @return View "results", kpiCalculator object and all activities' data
	 */
	@RequestMapping(value = "/getResults", method = RequestMethod.GET)
	public ModelAndView getResults(ModelAndView model) {
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

		return model;

	}

}
