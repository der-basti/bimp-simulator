package ee.ut.math.bimp.data;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * Activity class fields represented as Strings for easy parsing to xml after
 * required formatting.
 * 
 * @author Marko
 * 
 */

@XmlRootElement
public class RepresentableActivity {

	private String description;

	private String avgDuration;

	private String avgIdle;

	private String avgWaiting;

	private String avgCost;

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getAvgDuration() {
		return avgDuration;
	}

	public void setAvgDuration(String avgDuration) {
		this.avgDuration = avgDuration;
	}

	public String getAvgIdle() {
		return avgIdle;
	}

	public void setAvgIdle(String avgIdle) {
		this.avgIdle = avgIdle;
	}

	public String getAvgWaiting() {
		return avgWaiting;
	}

	public void setAvgWaiting(String avgWaiting) {
		this.avgWaiting = avgWaiting;
	}

	public String getAvgCost() {
		return avgCost;
	}

	public void setAvgCost(String avgCost) {
		this.avgCost = avgCost;
	}

}
