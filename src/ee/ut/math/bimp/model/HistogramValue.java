package ee.ut.math.bimp.model;

public class HistogramValue {
  private int[] counts;
  private String[] intervals;

  public HistogramValue() {
    this.counts = new int[0];
    this.intervals = new String[0];
  }

  public HistogramValue(int[] counts, String[] intervals) {
    this.counts = counts;
    this.intervals = intervals;
  }

  public int[] getCounts() {
    return counts;
  }

  public void setCounts(int[] counts) {
    this.counts = counts;
  }

  public String[] getIntervals() {
    return intervals;
  }

  public void setIntervals(String[] intervals) {
    this.intervals = intervals;
  }

}
