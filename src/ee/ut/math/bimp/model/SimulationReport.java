package ee.ut.math.bimp.model;

import java.util.List;

public class SimulationReport {
  private String fileName;
  private List<Event> events;
  private boolean hasError;
  private double duration;

  public SimulationReport(String fileName) {
    this.fileName = fileName;
  }

  public List<Event> getEvents() {
    return events;
  }

  public void setEvents(List<Event> events) {
    this.events = events;
  }

  public String getFileName() {
    return fileName;
  }

  public void setFileName(String fileName) {
    this.fileName = fileName;
  }

  public boolean isHasError() {
    for (Event e : events) {
      if (e.getErrorCode() != 0) {
        return true;
      }
    }
    return false;
  }

  public void setHasError(boolean hasError) {
    this.hasError = hasError;
  }

  public double getDuration() {
    double d = 0;
    for (Event e : events) {
      d += e.getDuration();
    }
    return d;
  }

  public void setDuration(double duration) {
    this.duration = duration;
  }

}
