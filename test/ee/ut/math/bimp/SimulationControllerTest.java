package ee.ut.math.bimp;

import javax.servlet.http.HttpServletRequest;
import static org.easymock.EasyMock.*;

import junit.framework.TestCase;

import org.junit.Test;

public class SimulationControllerTest extends TestCase {

	@Test(timeout = 1000)
	public void testSimulationStart() {
		HttpServletRequest request = createStrictMock(HttpServletRequest.class);
		
		assertEquals(1,1);
	}
}
