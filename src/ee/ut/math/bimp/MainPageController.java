package ee.ut.math.bimp;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class MainPageController {

	private static Logger log = Logger.getLogger(MainPageController.class);


	/**
	 * Default controller.
	 * 
	 * @return
	 */
	@RequestMapping(value = "", method = RequestMethod.GET)
	public String init(ModelMap model, HttpServletRequest request) {

		log.debug("/ requested, sending message");
		return "index";
	}

	@RequestMapping(value = "/upload", method = RequestMethod.GET)
	public String upload(ModelMap model) {

		log.debug("/upload requested, sending page");
		return "upload";
	}

	@RequestMapping(value = "/help", method = RequestMethod.GET)
	public String help(ModelMap model) {

		log.debug("/help requested, sending page");
		return "help";
	}

	@RequestMapping(value = "/contact", method = RequestMethod.GET)
	public String contact(ModelMap model) {

		log.debug("/contact requested, sending page");
		return "contact";
	}
	@RequestMapping(value = "/test", method = RequestMethod.GET)
	public String test(ModelMap model) {
		
		log.debug("/test requested, sending page");
		return "test";
	}

	/**
	 * Controller for the logfile download. Writes the file to the response.
	 * @param request
	 * @param download Represents the type of the requested artifact
	 * @param response
	 */
	@RequestMapping(value = "/file", method = RequestMethod.POST)
	public void getFile(HttpServletRequest request, String download,
			HttpServletResponse response) {

		HttpSession session = request.getSession();
		String fileName = (String) session.getAttribute("fileName");

		response.setContentType("text/xml");
		
		String extension = "";
		if ("log".equals(download)) {
			extension = ".mxml.gz";
			response.setContentType("application/x-gzip");
		} else if ("resultxml".equals(download)) {
			String id = (String) request.getSession().getAttribute("id");
			fileName = "results_" + id;
			extension = ".xml";
		}
		
		response.addHeader("Content-Disposition", "attachment; filename="
				+ fileName + extension);
		String path = request.getSession().getServletContext()
				.getRealPath("/tmp/" + "/" + fileName + extension);
		
		File file = new File(path);
		FileInputStream inputStream = null;
		try {
			inputStream = new FileInputStream(file);
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}
		
		try {
			FileCopyUtils.copy(inputStream, response.getOutputStream());
		} catch (IOException e) {
			e.printStackTrace();
		}

	}

}
