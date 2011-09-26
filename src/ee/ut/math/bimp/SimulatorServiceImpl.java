package ee.ut.math.bimp;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import ee.ut.bpsimulator.logger.ComplexLogger;
import ee.ut.bpsimulator.logger.ConsoleLogger;
import ee.ut.bpsimulator.logger.KpiCalculator;
import ee.ut.bpsimulator.logger.MxmlLogger;
import ee.ut.bpsimulator.model.Activity;
import ee.ut.bpsimulator.BPSimulator;
import ee.ut.math.bimp.example.SimulationChecker;

/**
 * Implementation for simulator service.
 * @author Marko
 *
 */
@Service
public class SimulatorServiceImpl implements SimulatorService {
	
	private static Logger log = Logger.getLogger(SimulatorServiceImpl.class);

	@Override
	public KpiCalculator startSimulator(String path) {
		//SIMULATING
		BPSimulator sim = new BPSimulator(path);
		KpiCalculator kpiStats = new KpiCalculator(sim);
		
		//TODO: better, configurable simchecker
		SimulationChecker checker = new SimulationChecker(path, sim, kpiStats, null);
		checker.start();
		
		try {
			log.debug("Running " + path);
			
			// can contain more than one logger (stats creation + mxml)
			ComplexLogger logger = sim.getLogger();

			// add stats calculator
			logger.addLogger(kpiStats);
			// start simulation
			sim.run();			
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return kpiStats;		
	}
	
}
