package ee.ut.math.bimp;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FileUtils;
import org.apache.log4j.Logger;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class TestProcessController {
	
	private static final String START = "start";
	private static final String REPORT = "report";
	private static final String GET_FILE = "getfile";
	private static final Logger log = Logger.getLogger(TestProcessController.class);
	private static final String TESTFILES_DIR = "/testfiles/";
	
	@RequestMapping(value="/runtestfiles", method=RequestMethod.GET)
	public String TestController(HttpServletResponse response, HttpServletRequest request, Model model) {
		String action = request.getParameter("action");
		log.info("action = " + action);
		if (action != null) {
			if (action.equalsIgnoreCase(START)) {
				initTestFiles(request);
				readTestFile(request, model, 0);
			} else if (action.equalsIgnoreCase(GET_FILE)) {
				String fileNr = request.getParameter("filenr");
				if (fileNr != null) {
					readTestFile(request, model, Integer.valueOf(fileNr));
				}
			}
		}
		return "/upload";
	}
	
	@RequestMapping(value="/runtestfiles", method=RequestMethod.POST)
	public void saveFileSimulationReport(HttpServletResponse response, HttpServletRequest request, Model model) {
		String simulationData = request.getParameter("simulationData");
		log.info(simulationData);
		JSONParser jsonParser = new JSONParser();
		JSONObject jsonResponse = new JSONObject();
		
		int errorCode = 0;
		String errorMessage = "";
		try {
			jsonParser.parse(simulationData);
		} catch (ParseException e) {
			log.error("Unable to parse simulation data: " + e.getMessage());
			errorCode = 1;
			errorMessage = "Unable to parse JSON";
		}
		
		try {
			PrintWriter writer = response.getWriter();
			writer.print(jsonResponse.toString());
			writer.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	private void readTestFile(HttpServletRequest request, Model model, int fileId) {
		String[] testFiles = (String[]) request.getSession().getAttribute("testFiles");
		String testFileContent = "";
		if (testFiles == null) {
			log.error("could not find testFiles from session");
		} else {
			log.info("testFile from session: " + testFiles[fileId]);
			String filePath = request.getSession().getServletContext().getRealPath(TESTFILES_DIR) + "/" + testFiles[fileId];
			File testFile = new File(filePath);
			try {
				testFileContent = FileUtils.readFileToString(testFile, "UTF-8");
				log.info("Read a testfile: " + testFileContent.substring(0, 200));
			} catch (Exception e) {
				log.error("Could not read file " + filePath);
				log.error(e.getMessage(), e);
			} 
			model.addAttribute("testFile", testFileContent);
			model.addAttribute("fileNr", fileId + 1);
			model.addAttribute("fileName", testFiles[fileId]);
			model.addAttribute("filesTotal", testFiles.length);
		}
		
	}
	
	private void initTestFiles(HttpServletRequest request) {
		File testFileDir = new File(request.getSession().getServletContext().getRealPath(TESTFILES_DIR));
		log.info("testFilesDir is :" + testFileDir.getAbsolutePath());
		if (testFileDir.isDirectory()) {
			log.info("it is dir");
			String[] content = testFileDir.list();
			request.getSession().setAttribute("testFiles", content);
		}
	}
}
