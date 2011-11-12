package ee.ut.math.bimp.data;

import org.springframework.web.multipart.commons.CommonsMultipartFile;

public class UploadItem
{
  private CommonsMultipartFile fileData;
  
  public CommonsMultipartFile getFileData()
  {
    return fileData;
  }
 
  public void setFileData(CommonsMultipartFile fileData)
  {
    this.fileData = fileData;
  }
}
