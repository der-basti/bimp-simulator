package ee.ut.math.bimp.model;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

public class SimulationReport {
  private String fileName;
  private List<Event> events;
  private boolean hasError;
  private Date startDate;

  public SimulationReport(String fileName) {
    this.fileName = fileName;
    this.startDate = new Date();
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

  public Date getStartDate() {
    return startDate;
  }

  public void setStartDate(Date startDate) {
    this.startDate = startDate;
  }

  public String getFormattedStartDate() {
    SimpleDateFormat std = new SimpleDateFormat("dd.MM.yyyy HH:mm:ss");
    return std.format(startDate);
  }

}
