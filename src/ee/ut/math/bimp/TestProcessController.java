package ee.ut.math.bimp;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.lang.reflect.Type;
import java.util.LinkedList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FileUtils;
import org.apache.log4j.Logger;
import org.json.simple.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import ee.ut.math.bimp.model.Event;
import ee.ut.math.bimp.model.SimulationReport;

@Controller
public class TestProcessController {

  private static final String START = "start";
  private static final String FINISH = "finished";
  private static final String GET_FILE = "getfile";
  private static final Logger log = Logger.getLogger(TestProcessController.class);
  private static final String TESTFILES_DIR = "/testfiles/";
  private static Gson gson = new Gson();
  private static final Type type = new TypeToken<List<Event>>() {
  }.getType();

  @RequestMapping(value = "/runtestfiles", method = RequestMethod.GET)
  public String TestController(HttpServletResponse response, HttpServletRequest request, Model model) {
    String action = request.getParameter("action");
    log.info("action = " + action);
    if (action != null) {
      if (action.equalsIgnoreCase(START)) {
        initTestFiles(request);
        readTestFile(request, model, 0);
        request.getSession().removeAttribute("simulationReports");
      } else if (action.equalsIgnoreCase(GET_FILE)) {
        String fileNr = request.getParameter("filenr");
        if (fileNr != null) {
          readTestFile(request, model, Integer.valueOf(fileNr));
        }
      } else if (action.equalsIgnoreCase(FINISH)) {
        List<SimulationReport> reports = (List<SimulationReport>) request.getSession().getAttribute("simulationReports");
        model.addAttribute("simulationReports", reports);
        return "/testreport";
      }
    }
    return "/upload";
  }

  @RequestMapping(value = "/testreport", method = RequestMethod.GET)
  public String getTestReport(HttpServletResponse response, HttpServletRequest request, Model model) {
    List<SimulationReport> reports = (List<SimulationReport>) request.getSession().getAttribute("simulationReports");
    model.addAttribute("simulationReports", reports);
    return "/testreport";
  }

  @RequestMapping(value = "/runtestfiles", method = RequestMethod.POST)
  public void saveFileSimulationReport(HttpServletResponse response, HttpServletRequest request, Model model) {
    try {
      String simulationData = request.getParameter("simulationData");
      log.info(simulationData);
      JSONObject jsonResponse = new JSONObject();

      int errorCode = 0;
      String errorMessage = "";
      try {
        List<Event> events = gson.fromJson(simulationData, type);
        SimulationReport simulationReport = (SimulationReport) request.getSession().getAttribute("simulationReport");
        simulationReport.setEvents(events);
        List<SimulationReport> reports = (List<SimulationReport>) request.getSession().getAttribute("simulationReports");
        if (reports == null) {
          reports = new LinkedList<SimulationReport>();
        }
        reports.add(simulationReport);
        request.getSession().setAttribute("simulationReports", reports);
        log.info("events = " + events.get(0).getStackTrace());
      } catch (Exception e) {
        log.warn("Unable to parse the simulation data", e);
        errorCode = 1;
        errorMessage = "Unable to parse the simulation data";
      }
      try {
        jsonResponse.put("errorCode", errorCode);
        jsonResponse.put("errorMessage", errorMessage);
        PrintWriter writer = response.getWriter();
        writer.print(jsonResponse.toString());
        writer.close();
      } catch (IOException e) {
        log.error("Unable to send json response", e);
      }
    } catch (Exception e) {
      log.error(e.getMessage(), e);
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
      request.getSession().setAttribute("simulationReport", new SimulationReport(testFiles[fileId]));
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
