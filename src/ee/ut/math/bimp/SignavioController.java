package ee.ut.math.bimp;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class SignavioController {
	
	@RequestMapping(value="/uploadsignavio", method=RequestMethod.POST)
	public String SignavioUploadController(HttpServletResponse response, HttpServletRequest request, Model model) {
		String file = (String) request.getParameter("file");
		if (file != null && !file.isEmpty()) {
			model.addAttribute("xmlFile", file);
			model.addAttribute("referer", request.getHeader("Referer"));
		}
		return "/upload";
	}
}
