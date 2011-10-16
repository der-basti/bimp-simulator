package ee.ut.math.bimp;

import static org.easymock.EasyMock.createMock;
import static org.easymock.EasyMock.createStrictMock;
import static org.easymock.EasyMock.expect;

import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServletRequest;

import junit.framework.TestCase;

import org.junit.Test;

public class SimulationControllerTest extends TestCase {

	@Test(timeout = 1000)
	public void testSimulationStart() {
		HttpServletRequest request = createStrictMock(HttpServletRequest.class);
		expect(request.getRequestDispatcher("/simulate")).andReturn(createStrictMock(RequestDispatcher.class));
		
	}
}
