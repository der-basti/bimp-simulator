package ee.ut.math.bimp.model;

import java.util.List;

public class TestReport {
  private List<SimulationReport> simulationReports;
  private double testDuration;
  private int fileCount;
  private int eventCount;
  private int successfulTestsCount;
  private String successPercentage;
  private int[] successfulEventsCount;

  public TestReport(List<SimulationReport> simulationReports) {
    this.simulationReports = simulationReports;
    setTestDuration();
    setSuccessfulTestsCount();
    setSuccessPercentage();
    setSuccessfulEventsCount();
    setEventCount();
  }

  public double getTestDuration() {
    return testDuration;
  }

  private void setTestDuration() {
    double duration = 0;
    for (SimulationReport sr : simulationReports) {
      duration += sr.getDuration();
    }
    this.testDuration = duration;
  }

  public int getFileCount() {
    return simulationReports.size();
  }

  public int getSuccessfulTestsCount() {
    return successfulTestsCount;
  }

  private void setSuccessfulTestsCount() {
    int count = 0;
    for (SimulationReport sr : simulationReports) {
      if (!sr.isHasError()) {
        count += 1;
      }
    }
    this.successfulTestsCount = count;
  }

  public String getSuccessPercentage() {
    return successPercentage;
  }

  private void setSuccessPercentage() {
    String result = "0";
    double success = getSuccessfulTestsCount();
    double total = Double.valueOf(getFileCount());
    if (success != 0 && total != 0) {
      double percentage = Math.round((success / total * 100) * 100) / 100;
      result = String.valueOf(percentage);
    }
    this.successPercentage = result;
  }

  public int[] getSuccessfulEventsCount() {
    return successfulEventsCount;
  }

  private void setSuccessfulEventsCount() {
    int[] result = new int[getEventCount()];
    for (SimulationReport sr : simulationReports) {
      final List<Event> events = sr.getEvents();
      for (int i = 0; i < events.size(); i++) {
        result[i] += events.get(i).getErrorCode() == 0 ? 1 : 0;
      }
    }
    this.successfulEventsCount = result;
  }

  public int getEventCount() {
    return eventCount;
  }

  private void setEventCount() {
    int count = 0;
    for (SimulationReport sr : simulationReports) {
      final int eventCount = sr.getEvents().size();
      if (eventCount > count) {
        count = eventCount;
      }
    }
    this.eventCount = count;
  }

  public List<SimulationReport> getSimulationReports() {
    return simulationReports;
  }

  public void setSimulationReports(List<SimulationReport> simulationReports) {
    this.simulationReports = simulationReports;
  }

}
