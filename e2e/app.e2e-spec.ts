import { LMSPage } from './app.po';

describe('lms App', () => {
  let page: LMSPage;

  beforeEach(() => {
    page = new LMSPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
