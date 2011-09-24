package ee.ut.math.bimp;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.*;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class MainPageController {
	
	private static Logger log = Logger.getLogger(MainPageController.class);
	
	@Autowired
	private SimulatorService simulatorService;
	
	@RequestMapping(value="", method = RequestMethod.GET)
	public String init(ModelMap model){
		
		log.debug("/ requested, sending message");
		model.addAttribute("msg", "It works!");

		return "index";
	}
	
	@RequestMapping(value="/upload", method = RequestMethod.GET)
	public String upload(ModelMap model){
		
		log.debug("/upload requested, sending page");

		return "upload";
	}
}
