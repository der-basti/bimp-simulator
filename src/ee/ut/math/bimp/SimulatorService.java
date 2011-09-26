package ee.ut.math.bimp;

import ee.ut.bpsimulator.logger.KpiCalculator;

/**
 * Service for running the simulator.
 * @author Marko
 *
 */
public interface SimulatorService {
	
	/**
	 * Starts the simulation.
	 * @param path the path to the file.
	 * @return KpiCalculator for report.
	 */
	public KpiCalculator startSimulator(String path);
	
}
