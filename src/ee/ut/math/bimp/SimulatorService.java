package ee.ut.math.bimp;

import org.springframework.stereotype.Service;



/**
 * Service for running the simulator.
 * @author Marko
 *
 */
@Service
public interface SimulatorService {
	
	/**
	 * Starts the simulation.
	 * @param path the path to the file.
	 */
	public void startSimulator(String path);
	
	/**
	 * @return checker
	 */
	public SimulationChecker getChecker();
	
}
