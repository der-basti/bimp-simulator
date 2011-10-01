package ee.ut.math.bimp;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.json.simple.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class MainPageController {

	private static Logger log = Logger.getLogger(MainPageController.class);

	public SimulatorRunner runner;

	public SimulationChecker checker;

	@RequestMapping(value = "", method = RequestMethod.GET)
	public String init(ModelMap model) {

		log.debug("/ requested, sending message");
		model.addAttribute("msg", "It works!");

		return "index";
	}

	@RequestMapping(value = "/upload", method = RequestMethod.GET)
	public String upload(ModelMap model) {

		log.debug("/upload requested, sending page");
		return "upload";
	}

	/**
	 * Secure(?) handling for the logfile download.
	 */
	@RequestMapping(value = "/file", method = RequestMethod.GET)
	public void getFile(HttpServletRequest request, HttpServletResponse response) {

		ServletOutputStream stream = null;
		BufferedInputStream buf = null;
		HttpSession session = request.getSession();
		String fileName = (String) session.getAttribute("fileName");

		response.setContentType("text/xml");
		response.addHeader("Content-Disposition", "attachment; filename="
				+ fileName + ".bpmn");
		File file = new File(request.getSession().getServletContext()
				.getRealPath("/tmp/")
				+ fileName);
		try {
			stream = response.getOutputStream();
			response.setContentLength((int) file.length());
			FileInputStream input = new FileInputStream(file);
			buf = new BufferedInputStream(input);
			int readBytes = 0;
			while ((readBytes = buf.read()) != -1) {
				stream.write(readBytes);
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			if (stream != null) {
				try {
					stream.close();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			if (buf != null) {
				try {
					buf.close();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}

	}

	@RequestMapping(value = "/getStatus", method = RequestMethod.POST)
	public void getStatus(HttpServletResponse response) {

		response.setContentType("application/json");
		JSONObject json = new JSONObject();
		String status = checker.getStatus();
		log.debug("!!Status: " + status);
		if(status.equals(null)) {
			status = "RUNNING";
		}
		json.put("status", status);

		try {
			PrintWriter writer = response.getWriter();
			writer.print(json.toString());
			writer.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	@RequestMapping(value = "/simulate", method = RequestMethod.GET)
	public String simulate(ModelMap model, HttpServletRequest request) {
		String path = request.getSession().getServletContext()
				.getRealPath("/samples/")
				+ "\\12895InsuranceClaimHandlingTimeTable.bpmn";
		runner = new SimulatorRunner();
		runner.init(path);
		checker = new SimulationChecker(path, runner.getSim(),
				runner.getKpiStats(), null);

		runner.start();

		return "loading";
	}
	
	@RequestMapping(value = "/getResults", method = RequestMethod.GET)
	public ModelAndView getResults(ModelAndView model) {
		model.setViewName("results");
		model.addObject("stats", runner.getKpiStats());
		return model;
		
	}
}
