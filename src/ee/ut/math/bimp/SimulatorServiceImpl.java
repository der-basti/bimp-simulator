package ee.ut.math.bimp;

public class SimulatorServiceImpl implements SimulatorService{
	
	public SimulationChecker checker;

	public SimulationChecker getChecker() {
		return checker;
	}

	@Override
	public void startSimulator(String path) {
		SimulatorRunner runner = new SimulatorRunner();
		
		runner.init(path);
		
		SimulationChecker checker = new SimulationChecker(path, runner.getSim(), runner.getKpiStats(), null);
		runner.start();
		
		checker.run();
	}

}
