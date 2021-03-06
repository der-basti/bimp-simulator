package ee.ut.math.bimp;

import java.io.IOException;
import java.io.PrintWriter;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.util.HashMap;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.xml.bind.JAXBException;

import org.apache.commons.lang.exception.ExceptionUtils;
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
import ee.ut.math.bimp.data.DataService;
import ee.ut.math.bimp.data.RepresentableActivity;
import ee.ut.math.bimp.data.ResultItem;
import ee.ut.math.bimp.model.HistogramValue;
import ee.ut.math.bimp.model.Simulation;
import ee.ut.math.bimp.simulation.SimulationChecker;
import ee.ut.math.bimp.simulation.SimulatorRunner;

/**
 * Simulation controller, responsible of simulation related activities like
 * starting the simulation, providing the status of it and providing the
 * simulation results.
 * 
 * @author Marko, Viljar
 * 
 */
@Controller
public class SimulationController {

  private static Logger log = Logger.getLogger(SimulationController.class);

  private final HashMap<String, Simulation> simulations = new HashMap<String, Simulation>();

  private ResultItem item;

  @Resource
  private DataService dataService;

  /**
   * Shows the status of the simulation, writes it out as JSON into the
   * response.
   */
  @RequestMapping(value = "/getStatus", method = RequestMethod.GET)
  @SuppressWarnings("unchecked")
  public void getStatus(HttpServletResponse response, HttpServletRequest request) {
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
        json.put("stacktrace", ExceptionUtils.getStackTrace(simulation.getException()));
        log.error(simulation.getException().getMessage(), simulation.getException());

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
      log.error("Writing response JSON failed", e);
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
    String path = request.getSession().getServletContext().getRealPath("/tmp/" + "in_" + id + ".bpmn");

    Simulation simulation = new Simulation(path);

    if (Boolean.valueOf((String) request.getSession().getAttribute("mxmlLog"))) {
      simulation.getRunner().setMxmlLog(new MxmlLogger(path));
    }

    model.addAttribute("id", id);
    simulations.put(id, simulation);
    try {
      simulation.start();
    } catch (Exception e) {
      simulation.setException(e);
      log.error("Simulation failed", e);
    }
    return "loading";
  }

  /**
   * Shows results.
   * 
   * @return View "results", all activities' data
   */
  @RequestMapping(value = "/getResults", method = RequestMethod.GET)
  public ModelAndView getResults(ModelAndView model, HttpServletRequest request) {
    HttpSession session = request.getSession();
    String id = (String) request.getSession().getAttribute("id");
    Simulation simulation = simulations.get(id);
    SimulatorRunner runner = simulation.getRunner();

    model.setViewName("results");

    KpiCalculator kpi = runner.getKpiStats();

    item = dataService.formatData(kpi);
    model.addObject("resultItem", item);

    if (runner.sim.getResourceManager().getDefinedResources() != null) {
      Object[] resources = runner.sim.getResourceManager().getDefinedResources().toArray();
      double[] utilization = new double[resources.length];
      String[] resourcesStr = new String[resources.length];
      DecimalFormatSymbols otherSymbols = new DecimalFormatSymbols();
      otherSymbols.setDecimalSeparator('.');
      otherSymbols.setGroupingSeparator(' ');
      DecimalFormat dec = new DecimalFormat("###.#", otherSymbols);
      for (int i = 0; i < resources.length; i++) {
        utilization[i] = Double.parseDouble(dec.format((kpi.getResourceUtilization((ee.ut.bpsimulator.model.Resource) resources[i]) * 100)));
        resourcesStr[i] = resources[i].toString().split("id")[0].split("Resource ")[1];
      }
      HistogramValue durationsHV = getHistogramValues(kpi.getProcessDurations(), false);
      HistogramValue waitingTimesHV = getHistogramValues(kpi.getProcessWaitingTimes(), false);
      HistogramValue costsHV = getHistogramValues(kpi.getProcessCosts(), true);

      Gson gsonObject = new Gson();

      model.addObject("durationIntervals", gsonObject.toJson(durationsHV.getIntervals()));
      model.addObject("waitingTimeIntervals", gsonObject.toJson(waitingTimesHV.getIntervals()));
      model.addObject("costIntervals", gsonObject.toJson(costsHV.getIntervals()));

      model.addObject("durationCounts", gsonObject.toJson(durationsHV.getCounts()));
      model.addObject("waitingTimeCounts", gsonObject.toJson(waitingTimesHV.getCounts()));
      model.addObject("costCounts", gsonObject.toJson(costsHV.getCounts()));

      model.addObject("resources", gsonObject.toJson(resourcesStr));
      model.addObject("utilization", gsonObject.toJson(utilization));
    }

    model.addObject("enableLogDownload", Boolean.valueOf((String) session.getAttribute("mxmlLog")));
    // simulations.remove(id);

    String path = request.getSession().getServletContext().getRealPath("/tmp/") + "/results_" + id + ".xml";

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
   * A method for calculating histogram values, that are used to display histograms with Google Charts
   * 
   * @param array contains the dataset
   * @param isCostChart boolean to specify, if the dataset contains process costs
   * @return HistogramValue object, containing the counts of values between calculated intervals
   */
  private HistogramValue getHistogramValues(double[] array, boolean isCostChart) {
    try {
      if (array == null) {
        return new HistogramValue(null, null);
      } else {
        double max = array[0];
        double min = array[0];
        for (int i = 0; i < array.length; i++) {
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

        int divisor = 1;
        String unit;

        if (isCostChart) {
          unit = "";
        } else if (max >= 432000) {
          divisor = 86400;
          unit = " days";
        } else if (max >= 18000) {
          divisor = 3600;
          unit = " h";
        } else if (max >= 300) {
          divisor = 60;
          unit = " min";
        } else {
          unit = " s";
        }

        double difference = (max - min) / divisor;
        log.info("difference = " + difference);
        if (difference == 0) {
          return new HistogramValue(new int[] { array.length }, new String[] { Math.floor(max / divisor) + unit });
        }
        String differenceStr = Long.toString((long) difference);
        char first = difference > 0 ? differenceStr.charAt(0) : '0';
        char second = difference >= 10 ? differenceStr.charAt(1) : '0';
        int powerOfTen = differenceStr.length() - 1;
        int interval;
        log.info("powerOfTen = " + powerOfTen);
        if (powerOfTen >= 2 && (first < '2' || first == '2' && second < '5')) {
          powerOfTen -= 2;
          interval = (int) (25 * (Math.pow(10, powerOfTen)));
        } else if (powerOfTen == 1 && first < '5') {
          powerOfTen -= 1;
          interval = (int) (5 * (Math.pow(10, powerOfTen)));
        } else {
          interval = (int) (Math.pow(10, powerOfTen));
        }

        int intervalAmount = (int) Math.ceil(difference / interval);
        log.info("intervalamount is " + intervalAmount);
        while (intervalAmount > Integer.MAX_VALUE - 5) {
          // a failsafe
          log.error("intervalamount is too big");
          interval = interval * 1000;
          intervalAmount = (int) Math.ceil(difference / interval);
        }
        int[] counts = new int[intervalAmount];
        String[] intervals = new String[intervalAmount];
        int lowest = ((int) (min / divisor / interval)) * interval;

        for (int i = 0; i < intervalAmount; i++) {
          intervals[i] = Integer.toString(((lowest + i * interval))) + " - " + Integer.toString(((lowest + (i + 1) * interval))) + unit;
        }

        for (double value : array) {
          int i = (int) ((value - min) / divisor / interval);
          if (i >= counts.length) {
            i = counts.length - 1;
          }
          counts[i] += 1;
        }

        return new HistogramValue(counts, intervals);
      }
    } catch (Exception e) {
      log.error(e.getCause(), e);
      return new HistogramValue();
    }
  }

  /**
   * @param request
   * @param response
   */
  @RequestMapping(value = "/getCsv", method = RequestMethod.POST)
  public void getCSV(HttpServletRequest request, HttpServletResponse response) {

    String fileName = (String) request.getSession().getAttribute("fileName");

    response.setContentType("text/csv");
    response.addHeader("Content-Disposition", "attachment; filename=" + fileName + ".csv");

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

      if (item.getCompletedElements() != null) {
        writer.append(String.valueOf(item.getCompletedElements()));
      } else {
        writer.append("");
      }
      writer.append(',');
      if (item.getCompletedProcessInstances() != null) {
        writer.append(String.valueOf(item.getCompletedProcessInstances()));
      } else {
        writer.append("");
      }
      writer.append(',');
      if (item.getMaxProcessCost() != null) {
        writer.append(String.valueOf(item.getMaxProcessCost()));
      } else {
        writer.append("");
      }
      writer.append(',');
      if (item.getMaxProcessDuration() != null) {
        writer.append(String.valueOf(item.getMaxProcessDuration()));
      } else {
        writer.append("");
      }
      writer.append(',');
      if (item.getMinProcessCost() != null) {
        writer.append(String.valueOf(item.getMinProcessCost()));
      } else {
        writer.append("");
      }
      writer.append(',');
      if (item.getMinProcessDuration() != null) {
        writer.append(String.valueOf(item.getMinProcessDuration()));
      } else {
        writer.append("");
      }
      writer.append(',');
      if (item.getTotalCost() != null) {
        writer.append(String.valueOf(item.getTotalCost()));
      } else {
        writer.append("");
      }
      writer.append(',');
      if (item.getTotalDuration() != null) {
        writer.append(String.valueOf(item.getTotalDuration()));
      } else {
        writer.append("");
      }
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
        if (activity.getDescription() != null) {
          writer.append(activity.getDescription());
        } else {
          writer.append("");
        }
        writer.append(',');
        if (activity.getAvgCost() != null) {
          writer.append(activity.getAvgCost());
        } else {
          writer.append("");
        }
        writer.append(',');
        if (activity.getAvgDuration() != null) {
          writer.append(activity.getAvgDuration());
        } else {
          writer.append("");
        }
        writer.append(',');
        if (activity.getAvgIdle() != null) {
          writer.append(activity.getAvgIdle());
        } else {
          writer.append("");
        }
        writer.append(',');
        if (activity.getAvgWaiting() != null) {
          writer.append(activity.getAvgWaiting());
        } else {
          writer.append("");
        }
        writer.append('\n');
      }

    } catch (IOException e) {
      e.printStackTrace();
    }
  }
}
