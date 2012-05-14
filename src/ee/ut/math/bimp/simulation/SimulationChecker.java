package ee.ut.math.bimp.simulation;

import ee.ut.bpsimulator.BPSimulator;
import ee.ut.bpsimulator.logger.KpiCalculator;
import ee.ut.bpsimulator.logger.MxmlLogger;

/**
 * A class that enables simulation status checking while the simulation is running.
 *
 */
public class SimulationChecker extends Thread {

  private final BPSimulator simInstance;
  private final KpiCalculator kpiStats;

  public String getStatus() {
    return simInstance.getStatus().toString();
  }

  public String getProgress() {
    return kpiStats.getCompletedProcesseInstances() + "/" + simInstance.getTotalProcessInstances();
  }

  public SimulationChecker(String sourceFile, BPSimulator simInstance, KpiCalculator kpiStats, MxmlLogger mxmlLogger) {
    this.simInstance = simInstance;
    this.kpiStats = kpiStats;
  }

}
