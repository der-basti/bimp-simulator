package ee.ut.math.bimp;

import org.springframework.stereotype.Service;
import ee.ut.bpsimulator.logger.ComplexLogger;
import ee.ut.bpsimulator.logger.ConsoleLogger;
import ee.ut.bpsimulator.logger.KpiCalculator;
import ee.ut.bpsimulator.logger.MxmlLogger;
import ee.ut.bpsimulator.BPSimulator;


@Service
public class SimulatorServiceImpl implements SimulatorService {

	@Override
	public void startSimulator() {
		BPSimulator sim = new BPSimulator("");
//		try {
//			System.out.println("Running " + fileName);
//			
//			ComplexLogger logger = sim.getLogger();
//			if (logMxml)
//				logger.addLogger(new MxmlLogger(fileName));
//			if (logToConsole)			
//				logger.addLogger(new ConsoleLogger());
//			logger.addLogger(new KpiCalculator());
//			sim.run();
//		} catch (Exception e) {
//			handleException(e);
//		}		
	}
	
}
