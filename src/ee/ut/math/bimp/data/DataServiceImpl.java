package ee.ut.math.bimp.data;

import java.io.FileWriter;
import java.io.IOException;
import java.io.Writer;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;

import org.springframework.stereotype.Service;

import ee.ut.bpsimulator.logger.KpiCalculator;
import ee.ut.bpsimulator.model.Activity;

/**
 * Implementation for DataService.
 * 
 * @author Marko
 * 
 */
@Service
public class DataServiceImpl implements DataService {

	public void createXML(ResultItem item, String path) throws JAXBException,
			IOException {
		JAXBContext context = JAXBContext.newInstance(ResultItem.class);
		Marshaller m = context.createMarshaller();
		m.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, Boolean.TRUE);
		m.setProperty(Marshaller.JAXB_ENCODING, "iso-8859-1");

		Writer w = null;
		try {
			w = new FileWriter(path);
			m.marshal(item, w);
		} finally {
			try {
				w.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	public ResultItem formatData(KpiCalculator kpi) {
		ResultItem item = new ResultItem();

		DecimalFormatSymbols otherSymbols = new DecimalFormatSymbols();
		otherSymbols.setDecimalSeparator('.');
		otherSymbols.setGroupingSeparator(' ');

		DecimalFormat dec = new DecimalFormat("###.##", otherSymbols);

		// format the values that can be accessed directly from the
		// KpiCalculator class
		item.setCompletedElements(dec.format(kpi.getCompletedElements()));
		item.setCompletedProcessInstances(dec.format(kpi
				.getCompletedProcesseInstances()));
		item.setMaxProcessDuration(dec.format(kpi.getMaxProcessDuration()));
		item.setMaxProcessCost(dec.format(kpi.getMaxProcessCost()));
		item.setMinProcessCost(dec.format(kpi.getMinProcessCost()));
		item.setMinProcessDuration(dec.format(kpi.getMinProcessDuration()));
		item.setTotalCost(dec.format(kpi.getTotalCost()));
		item.setTotalDuration(dec.format(kpi.getTotalDuration()));

		// format the activity values from the KpiCalculator class
		List<RepresentableActivity> activities = new ArrayList<RepresentableActivity>();
		for (Activity activity : kpi.getAllElements()) {

			RepresentableActivity repActivity = new RepresentableActivity();

			int count = kpi.getElementCount(activity);

			repActivity
					.setDescription(activity.getDescription().isEmpty() ? "n/a"
							: activity.getDescription());

			repActivity.setAvgDuration(dec.format(kpi
					.getElementTotalDuration(activity) / count));

			repActivity
					.setAvgIdle(kpi.getElementTotalIdleTime(activity) != 0 ? dec
							.format(kpi.getElementTotalIdleTime(activity)
									/ count) : "n/a");

			repActivity
					.setAvgWaiting((kpi.getElementTotalWaitingTime(activity)) != null
							&& (kpi.getElementTotalWaitingTime(activity) > 0) ? dec
							.format(kpi.getElementTotalWaitingTime(activity)
									/ count) : "n/a");

			repActivity
					.setAvgCost((kpi.getElementTotalCost(activity) / count) != 0 ? dec
							.format(kpi.getElementTotalCost(activity) / count)
							: "n/a");

			activities.add(repActivity);

		}

		item.setActivities(activities);

		return item;
	}

}
