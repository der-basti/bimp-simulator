package ee.ut.math.bimp;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.xml.bind.JAXBException;

import org.apache.log4j.Logger;
import org.json.simple.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import ee.ut.bpsimulator.logger.KpiCalculator;
import ee.ut.bpsimulator.logger.MxmlLogger;
import ee.ut.math.bimp.data.DataService;
import ee.ut.math.bimp.data.RepresentableActivity;
import ee.ut.math.bimp.data.ResultItem;
import ee.ut.math.bimp.data.Simulation;

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

	private ResultItem item;

	@Resource
	private DataService dataService;

	/**
	 * Shows the status of the simulation, writes it out as JSON into the
	 * response.
	 */
	@RequestMapping(value = "/getStatus", method = RequestMethod.POST)
	@SuppressWarnings("unchecked")
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
			log.debug(e.getStackTrace());
			e.printStackTrace();
		}
		return "loading";
	}

	/**
	 * Shows results.
	 * 
	 * @return View "results", all activities' data
	 */
	@RequestMapping(value = "/getResults", method = RequestMethod.GET)
	public ModelAndView getResults(ModelAndView model,
			HttpServletRequest request) {
		HttpSession session = request.getSession();
		String id = (String) request.getSession().getAttribute("id");
		Simulation simulation = simulations.get(id);
		SimulatorRunner runner = simulation.getRunner();

		model.setViewName("results");

		KpiCalculator kpi = runner.getKpiStats();

		item = dataService.formatData(kpi);
		model.addObject("resultItem", item);
		model.addObject("enableLogDownload",
				Boolean.valueOf((String) session.getAttribute("mxmlLog")));
		// simulations.remove(id);

		String path = request.getSession().getServletContext()
				.getRealPath("/tmp/")
				+ "/results_" + id + ".xml";

		try {
			dataService.createXML(item, path);
		} catch (JAXBException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}

		return model;

	}

	/**
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/getCsv", method = RequestMethod.POST)
	public void getCSV(HttpServletRequest request, HttpServletResponse response) {

		String fileName = (String) request.getSession()
				.getAttribute("fileName");

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

			writer.append(String.valueOf(item.getCompletedElements()));
			writer.append(',');
			writer.append(String.valueOf(item.getCompletedProcessInstances()));
			writer.append(',');
			writer.append(String.valueOf(item.getMaxProcessCost()));
			writer.append(',');
			writer.append(String.valueOf(item.getMaxProcessDuration()));
			writer.append(',');
			writer.append(String.valueOf(item.getMinProcessCost()));
			writer.append(',');
			writer.append(String.valueOf(item.getMinProcessDuration()));
			writer.append(',');
			writer.append(String.valueOf(item.getTotalCost()));
			writer.append(',');
			writer.append(String.valueOf(item.getTotalDuration()));
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

			for (RepresentableActivity activity : item.getActivities()) {
				writer.append(activity.getDescription());
				writer.append(',');
				writer.append(activity.getAvgCost());
				writer.append(',');
				writer.append(activity.getAvgDuration());
				writer.append(',');
				writer.append(activity.getAvgIdle());
				writer.append(',');
				writer.append(activity.getAvgWaiting());
				writer.append('\n');
			}

		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
