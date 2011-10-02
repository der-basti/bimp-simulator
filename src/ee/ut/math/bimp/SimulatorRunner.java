package ee.ut.math.bimp;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import ee.ut.bpsimulator.BPSimulator;
import ee.ut.bpsimulator.logger.ComplexLogger;
import ee.ut.bpsimulator.logger.KpiCalculator;

/**
 * Simulator runner.
 * 
 * @author Marko
 * 
 */
public class SimulatorRunner {

	private static Logger log = Logger.getLogger(SimulatorRunner.class);

	public BPSimulator sim;

	public KpiCalculator kpiStats;

	public String path;

	public BPSimulator getSim() {
		return sim;
	}

	public KpiCalculator getKpiStats() {
		return kpiStats;
	}

	public String getPath() {
		return path;
	}

	/**
	 * Initializes the simulator and stats calculator.
	 * 
	 * @param path
	 *            the file path.
	 */
	public void init(String path) {
		this.path = path;
		sim = new BPSimulator(path);
		kpiStats = new KpiCalculator(sim);
	}

	/**
	 * Starts the simulation.
	 */
	public void start() {
		if (sim != null && kpiStats != null) {

			try {
				log.debug("Running simulation");

				ComplexLogger logger = sim.getLogger();

				logger.addLogger(kpiStats);

				sim.run();
			} catch (Exception e) {
				e.printStackTrace();
			}

		}
	}

}
