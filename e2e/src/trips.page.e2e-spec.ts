import { AppPage } from './app.po';

import { browser, by, element } from 'protractor';

describe('Trips e2e tests', () => {
  let page: AppPage;

  beforeEach(async () => {
    page = new AppPage();
  });

  it('should default to upcoming trips', async () => {
    await page.navigateTo('/trips');
    expect(await page.getPageHeaderText('app-trips')).toBe('Upcoming Trips');
  });

  it('should show the upcoming trips', async () => {
    await page.navigateTo('/trips/upcoming');
    expect(await page.getPageHeaderText('app-trips')).toBe('Upcoming Trips');
  });

  it('should show the past trips', async () => {
    await page.navigateTo('/trips/past');
    expect(await page.getPageHeaderText('app-trips')).toBe('Past Trips');
  });

});
