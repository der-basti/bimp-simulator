package ee.ut.math.bimp;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStreamReader;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FileUtils;
import org.apache.log4j.Logger;
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
		String action = (String) request.getParameter("action");
		log.info("action = " + action);
		if (action.equalsIgnoreCase(START)) {
			initTestFiles(request);
			readTestFile(request, model, 0);
		} else if (action.equalsIgnoreCase(REPORT)) {
			
		} else if (action.equalsIgnoreCase(GET_FILE)) {
			
		}
		return "/upload";
	}
	
	private void readTestFile(HttpServletRequest request, Model model, int fileNr) {
		String[] testFiles = (String[]) request.getSession().getAttribute("testFiles");
		String testFileContent = "";
		if (testFiles == null) {
			log.error("could not find testFiles from session");
		} else {
			log.info("testFile from session: " + testFiles[fileNr]);
			String filePath = request.getSession().getServletContext().getRealPath(TESTFILES_DIR) + "/" + testFiles[fileNr];
			File testFile = new File(filePath);
			try {
				testFileContent = FileUtils.readFileToString(testFile, "UTF-8");
				log.info("Read a testfile: " + testFileContent.substring(0, 200));
			} catch (Exception e) {
				log.error("Could not read file " + filePath);
				log.error(e.getMessage(), e);
			} 
			model.addAttribute("testFile", testFileContent);
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
