package ee.ut.math.bimp.model;

import java.util.List;

public class TestReport {
  private List<SimulationReport> simulationReports;

  public double getTestDuration() {
    double duration = 0;
    for (SimulationReport sr : simulationReports) {
      duration += sr.getDuration();
    }
    return duration;
  }

  public int getFileCount() {
    return simulationReports.size();
  }

  public int getUnsuccessfulTestsCount() {
    int count = 0;
    for (SimulationReport sr : simulationReports) {
      if (sr.isHasError()) {
        count += 1;
      }
    }
    return count;
  }

  public int[] getSuccessfulEventsCount() {
    int[] result = new int[getEventCount()];
    for (SimulationReport sr : simulationReports) {
      final List<Event> events = sr.getEvents();
      for (int i = 0; i < events.size(); i++) {
        result[i] += events.get(i).getErrorCode() == 0 ? 1 : 0;
      }
    }
    return result;
  }

  private int getEventCount() {
    int count = 0;
    for (SimulationReport sr : simulationReports) {
      final int eventCount = sr.getEvents().size();
      if (eventCount > count) {
        count = eventCount;
      }
    }
    return count;
  }

  public List<SimulationReport> getSimulationReports() {
    return simulationReports;
  }

  public void setSimulationReports(List<SimulationReport> simulationReports) {
    this.simulationReports = simulationReports;
  }

}
