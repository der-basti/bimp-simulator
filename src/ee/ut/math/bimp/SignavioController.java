package ee.ut.math.bimp;

import javax.servlet.http.HttpServletRequest;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * A controller, enabling 3rd-party applications to provide the process model with a POST request,
 * where request parameter named "file" contains the process model.
 * @author Viljar Kärgenberg
 *
 */
@Controller
public class SignavioController {
	
	@RequestMapping(value="/uploadsignavio", method=RequestMethod.POST)
	public String SignavioUploadController(HttpServletResponse response, HttpServletRequest request, Model model) {
		String file = (String) request.getParameter("file");
		if (StringUtils.isNotEmpty(file)) {
			model.addAttribute("xmlFile", file);
			model.addAttribute("referer", request.getHeader("Referer"));
		}
		return "/upload";
	}
}
