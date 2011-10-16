package ee.ut.math.bimp;

import ee.ut.bpsimulator.logger.MxmlLogger;

/**
 * Simulation class for holding all simulation related objects
 * 
 * @author Viljar
 * 
 */
public class Simulation {
	private SimulatorRunner runner;
	private SimulationChecker checker;
	private MxmlLogger mxmlLog;

	public Simulation(String filePath) {
		this.runner = new SimulatorRunner();
		this.runner.init(filePath);
		this.checker = new SimulationChecker(filePath, runner.getSim(),
				runner.getKpiStats(), mxmlLog);
	}

	public void start() {
		this.runner.start();
	}

	public SimulatorRunner getRunner() {
		return runner;
	}

	public void setRunner(SimulatorRunner runner) {
		this.runner = runner;
	}

	public SimulationChecker getChecker() {
		return checker;
	}

	public void setChecker(SimulationChecker checker) {
		this.checker = checker;
	}

	public MxmlLogger getMxmlLog() {
		return mxmlLog;
	}

	public void setMxmlLog(MxmlLogger mxmlLog) {
		this.mxmlLog = mxmlLog;
	}

}
