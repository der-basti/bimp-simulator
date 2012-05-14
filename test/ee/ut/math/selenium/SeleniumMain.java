package ee.ut.math.selenium;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;

import org.apache.commons.io.FileUtils;
import org.openqa.selenium.Platform;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.WebDriverWait;

/**
 * A Selenium test to initialise the automated tests in Jenkins by using Saucelabs OnDemand service.
 * @author Viljar Kärgenberg
 *
 */
public class SeleniumMain {

  public static void main(String[] args) throws MalformedURLException {
    // WebDriver driver = new FirefoxDriver();
    // driver.get("localhost:8080/runtestfiles?action=start");

    DesiredCapabilities capabilities = DesiredCapabilities.chrome();
    // capabilities.setCapability("version", "7");
    capabilities.setCapability("platform", Platform.VISTA);
    capabilities.setCapability("name", "BIMP Online simulation tests");

    WebDriver driver = new RemoteWebDriver(new URL("http://viljark:e9d38972-dba8-4713-89ff-e621ebf88c91@ondemand.saucelabs.com:80/wd/hub"),
        capabilities);
    driver.get("fafafa.fa:8080/runtestfiles?action=start");
    (new WebDriverWait(driver, 600, 20)).until(new ExpectedCondition<Boolean>() {
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
