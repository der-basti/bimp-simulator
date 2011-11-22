package ee.ut.math.bimp;


import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.PrintStream;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.json.simple.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.multipart.MultipartFile;

import ee.ut.math.bimp.data.UploadItem;

@Controller
public class FileUploadController {

	private static Logger log = Logger.getLogger(FileUploadController.class);
	
	@RequestMapping(value="/uploadfile", method = RequestMethod.POST)
	public String onSubmit(HttpServletRequest request, UploadItem uploadItem, BindingResult result, ModelMap model){

	    if (result.hasErrors())
	    {
	      for(ObjectError error : result.getAllErrors())
	      {
	        log.error("Error: " + error.getCode() +  " - " + error.getDefaultMessage());
	      }
	      return "upload/uploadForm";
	    }
        MultipartFile file = uploadItem.getFileData();
        if (file == null) {
        	log.debug("Nothing was uploaded");
        } else {
        	log.debug("File " + file.getName() + " uploaded.");
        	File ff;
        	File f = new File(request.getSession().getServletContext().getRealPath("/tmp/"));
        	f.mkdirs();
			try {
				ff = File.createTempFile("in_", ".bpmn", f);
				
				file.transferTo(ff);
				log.info("Uploaded file: " + ff.getAbsolutePath());
				String fileName = ff.getName();
				String[] al = fileName.split("\\.");
				String id = al[0].split("_")[1];
				System.out.println(id);
				request.getSession().setAttribute("id", id);
				/*model.addAttribute("file", file);
				
				model.addAttribute("msg", "<span>File uploaded.</span> <a href='./tmp/"+ff.getName()+"'>Download</a>");
				model.addAttribute("path", ff.getAbsolutePath());*/
				
			} catch (IOException e) {
				model.addAttribute("msg", "<span>Error uploading file.</span>");
				log.error("Could not create file", e);
				return "upload";
			} 
        }
        	
			return "redirect:/simulate";
    }
	
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/uploadjson", method = RequestMethod.POST)
	public void uploadFile(HttpServletRequest request, String fileData, String mxmlLog, ModelMap model, HttpServletResponse response) {
		model.addAttribute("msg", fileData);
		String result = "Error";
		if (StringUtils.isNotEmpty(fileData)) {
			FileOutputStream fout = null;
			File ff;
        	File f = new File(request.getSession().getServletContext().getRealPath("/tmp/"));
        	f.mkdirs();
			try {
				ff = File.createTempFile("in_", ".bpmn", f);
				try {
					fout = new FileOutputStream (ff.getAbsolutePath());
				} catch (FileNotFoundException e) {
					log.error("Could not find file", e);
				}
				PrintStream ps = new PrintStream(fout);
				OutputStreamWriter out = new OutputStreamWriter(ps, "UTF-8");
				out.write(fileData);
				out.flush();
				out.close();
				log.info("Uploaded file: " + ff.getAbsolutePath());
				String fileName = ff.getName();
				String[] al = fileName.split("\\.");
				String id = al[0].split("_")[1];
				request.getSession().setAttribute("id", id);
				request.getSession().setAttribute("fileName", fileName);
				request.getSession().setAttribute("mxmlLog", mxmlLog);
				result = "Success";
				
			} catch (IOException e) {
				log.error("Could not create file", e);
			}
			
		}
		
		response.setContentType("application/json");
		JSONObject json = new JSONObject();
		json.put("status", result);
		if (result.equalsIgnoreCase("success")) {
			json.put("redirect", "/simulate");
		}
		try {
			PrintWriter writer = response.getWriter();
			writer.print(json.toString());
			writer.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}

