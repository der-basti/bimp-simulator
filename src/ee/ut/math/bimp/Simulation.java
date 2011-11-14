package ee.ut.math.bimp;



/**
 * Simulation class for holding all simulation related objects
 * 
 * @author Viljar
 * 
 */
public class Simulation {
	private SimulatorRunner runner;
	private SimulationChecker checker;
	private Exception exception;
	
	public Simulation(String filePath) {
		this.runner = new SimulatorRunner();
		this.runner.init(filePath);
		this.exception = null;
		this.checker = new SimulationChecker(filePath, runner.getSim(),
				runner.getKpiStats(), runner.getMxmlLog());
	}

	public void start() throws Exception  {
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

	public Exception getException() {
		return exception;
	}

	public void setException(Exception exception) {
		this.exception = exception;
	}


}
