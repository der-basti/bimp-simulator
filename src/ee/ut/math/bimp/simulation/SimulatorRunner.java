package ee.ut.math.bimp.simulation;

import org.apache.log4j.Logger;

import ee.ut.bpsimulator.BPSimulator;
import ee.ut.bpsimulator.logger.ComplexLogger;
import ee.ut.bpsimulator.logger.KpiCalculator;
import ee.ut.bpsimulator.logger.MxmlLogger;

/**
 * Simulator runner.
 * 
 * @author Marko & Viljar
 * 
 */
public class SimulatorRunner {

  private static Logger log = Logger.getLogger(SimulatorRunner.class);

  public BPSimulator sim;

  public KpiCalculator kpiStats;

  public String path;

  public MxmlLogger mxmlLog;

  public BPSimulator getSim() {
    return sim;
  }

  public KpiCalculator getKpiStats() {
    return kpiStats;
  }

  public String getPath() {
    return path;
  }

  public void setMxmlLog(MxmlLogger mxmlLog) {
    this.mxmlLog = mxmlLog;
  }

  public MxmlLogger getMxmlLog() {
    return mxmlLog;
  }

  /**
   * Initializes the simulator and stats calculator.
   * 
   * @param path the file path.
   */
  public void init(String path) {
    this.path = path;
    BPSimulator.MAX_COMPLETED_ELEMENTS = 3000000;
    sim = new BPSimulator(path);
    kpiStats = new KpiCalculator(sim);
  }

  /**
   * Starts the simulation.
   * 
   * @throws Exception
   */
  public void start() throws Exception {
    if (sim != null && kpiStats != null) {

      log.debug("Running simulation");

      ComplexLogger logger = sim.getLogger();
      if (mxmlLog != null) {
        log.debug("WILL LOG");
        logger.addLogger(mxmlLog);
      }
      logger.addLogger(kpiStats);

      sim.run();

    }
  }
}
