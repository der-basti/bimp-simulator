package ee.ut.math.bimp;
import java.io.File;
import java.util.List;

import ee.ut.bpsimulator.BPSimulator;
import ee.ut.bpsimulator.logger.KpiCalculator;
import ee.ut.bpsimulator.logger.MxmlLogger;
import ee.ut.bpsimulator.model.Activity;


public class SimulationChecker extends Thread {

	private BPSimulator simInstance;
	private KpiCalculator kpiStats;
	private MxmlLogger mxmlLogger;
	private String sourceFile;
	
	public String getStatus() {
		return simInstance.getStatus().toString();
	}
	public String getProgress() {
		return kpiStats.getCompletedProcesseInstances() + "/" + simInstance.getTotalProcessInstances();
	}
	
	public SimulationChecker(String sourceFile, BPSimulator simInstance, KpiCalculator kpiStats, MxmlLogger mxmlLogger) {
		this.simInstance = simInstance;
		this.kpiStats = kpiStats;
		this.mxmlLogger = mxmlLogger;
		this.sourceFile = sourceFile;
	}
	
//	public void run() {
//		while (isAlive()) {
//			System.out.println("Sim status: " + simInstance.getStatus());
//			
//			switch (simInstance.getStatus()) {
//            case FINISHED:
//            	// simulation finished, return report
//            	System.out.println("Finished, element stats:");
//            	List<Activity> elements = kpiStats.getAllElements();
//	            for (Activity a: elements) {
//	              System.out.println(a.getDescription() + ":: Count " + kpiStats.getElementCount(a) + " Total cost: " + kpiStats.getElementTotalCost(a));
//	              // see other methods in KpiCalculator object to get, waiting time, duration, idle time 
//	            }
//            	// if MXML logger was attached, return mxml file
//            	if (mxmlLogger != null) {
//            		File mxmlFile = new File(sourceFile + ".mxml.gz");
////            		System.out.println("Download MXML from " + mxmlFile.getAbsolutePath());
//            	}
//            	return;
//	            
//            case FINALIZING:
//            	// writing logs, might take several minutes            	            
//            default:
//            	
//            	// running
//            	System.out.println("Processes: " + kpiStats.getCompletedProcesseInstances() + "/" + simInstance.getTotalProcessInstances());
//	            break;
//            }
//			
//			try {
//		        Thread.sleep(500);
//	        } catch (InterruptedException e) {
//		        // TODO Auto-generated catch block
//		        e.printStackTrace();
//	        }
//		}
//	}
	
}
