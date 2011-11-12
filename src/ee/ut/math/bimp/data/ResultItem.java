package ee.ut.math.bimp.data;

import java.util.Collection;
import java.util.List;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * Represents a result of the simulation.
 * 
 * @author Marko
 * 
 */

@XmlRootElement(name = "results")
public class ResultItem {

	private String completedElements;

	private String completedProcessInstances;

	private String maxProcessCost;

	private String maxProcessDuration;

	private String minProcessCost;

	private String minProcessDuration;

	private String totalCost;

	private String totalDuration;

	private Collection<RepresentableActivity> activities;

	public String getCompletedElements() {
		return completedElements;
	}

	public void setCompletedElements(String completedElements) {
		this.completedElements = completedElements;
	}

	public String getCompletedProcessInstances() {
		return completedProcessInstances;
	}

	public void setCompletedProcessInstances(String completedProcessInstances) {
		this.completedProcessInstances = completedProcessInstances;
	}

	public String getMaxProcessCost() {
		return maxProcessCost;
	}

	public void setMaxProcessCost(String maxProcessCost) {
		this.maxProcessCost = maxProcessCost;
	}

	public String getMaxProcessDuration() {
		return maxProcessDuration;
	}

	public void setMaxProcessDuration(String maxProcessDuration) {
		this.maxProcessDuration = maxProcessDuration;
	}

	public String getMinProcessCost() {
		return minProcessCost;
	}

	public void setMinProcessCost(String minProcessCost) {
		this.minProcessCost = minProcessCost;
	}

	public String getMinProcessDuration() {
		return minProcessDuration;
	}

	public void setMinProcessDuration(String minProcessDuration) {
		this.minProcessDuration = minProcessDuration;
	}

	public String getTotalCost() {
		return totalCost;
	}

	public void setTotalCost(String totalCost) {
		this.totalCost = totalCost;
	}

	public String getTotalDuration() {
		return totalDuration;
	}

	public void setTotalDuration(String totalDuration) {
		this.totalDuration = totalDuration;
	}

	@XmlElement(name = "activity")
	public Collection<RepresentableActivity> getActivities() {
		return activities;
	}

	public void setActivities(List<RepresentableActivity> activities) {
		this.activities = activities;
	}

}
