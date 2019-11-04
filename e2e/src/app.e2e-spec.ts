import { AppPage } from './app.po';

describe('new App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });
  describe('default screen', () => {
    it('should have a title saying Fiits', async () => {
      await page.navigateTo('/');
      expect(await page.getTitle()).toBe('Fiits');
    });

    it('should default to the search page', async () => {
      await page.navigateTo('/');
      expect(await page.getPageHeaderText('app-search')).toBe('Search');
    });

    it('should have a title saying Search', async () => {
      await page.navigateTo('/search');
      expect(await page.getPageHeaderText('app-search')).toBe('Search');
    });

    it('should have a title saying Payments', async () => {
      await page.navigateTo('/payments');
      expect(await page.getPageHeaderText('app-payments')).toBe('Payments');
    });

    it('should have a title saying Feedback', async () => {
      await page.navigateTo('/feedback');
      expect(await page.getPageHeaderText('app-feedback')).toBe('Feedback');
    });

    it('should have a title saying Sign In', async () => {
      await page.navigateTo('/sign-in');
      expect(await page.getPageHeaderText('app-sign-in')).toBe('Sign In');
    });
  });
});
