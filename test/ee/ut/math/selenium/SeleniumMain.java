package ee.ut.math.selenium;

import java.io.File;
import java.io.IOException;

import org.apache.commons.io.FileUtils;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.WebDriverWait;

public class SeleniumMain {

  public static void main(String[] args) {
    WebDriver driver = new FirefoxDriver();
    driver.get("localhost:8080/runtestfiles?action=start");
    (new WebDriverWait(driver, 20, 2)).until(new ExpectedCondition<Boolean>() {
      @Override
      public Boolean apply(WebDriver d) {
        return d.getTitle().toLowerCase().startsWith("test report");
      }
    });
    File file = new File("testreport.html");
    try {
      FileUtils.writeStringToFile(file, driver.getPageSource());
    } catch (IOException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
    }
    driver.quit();
  }

}
