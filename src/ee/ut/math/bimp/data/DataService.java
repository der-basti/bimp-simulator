package ee.ut.math.bimp.data;

import java.io.IOException;

import javax.xml.bind.JAXBException;

import ee.ut.bpsimulator.logger.KpiCalculator;

/**
 * Service for manipulating data.
 * @author Marko
 *
 */
public interface DataService {

	/**
	 * Creates an xml file.
	 * @param item ResultItem that the xml will represent.
	 * @param path path of the xml file.
	 * @throws JAXBException
	 * @throws IOException
	 */
	public void createXML(ResultItem item, String path) throws JAXBException,
			IOException;
	
	/**
	 * Formats the data to required representation format.
	 * @param kpi KpiCalculator
	 * @return ResultItem with formatted data.
	 */
	public ResultItem formatData(KpiCalculator kpi);
}
