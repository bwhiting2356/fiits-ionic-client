import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo(destination) {
    return browser.get(destination);
  }

  getTitle() {
    return browser.getTitle();
  }

  getPageHeaderText(page) {
    browser.waitForAngularEnabled(false);
    return element(by.deepCss(`${page} ion-title`)).getText();
  }
}
