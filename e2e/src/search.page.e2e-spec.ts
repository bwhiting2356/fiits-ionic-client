import { AppPage } from './app.po';

import { browser, by, element } from 'protractor';

const waitForTime = milliseconds => new Promise(resolve => {
  setTimeout(() => {
    resolve();
  }, milliseconds);
});

describe('Search e2e tests', () => {
  let page: AppPage;

  beforeEach(async () => {
    page = new AppPage();
  });

});
