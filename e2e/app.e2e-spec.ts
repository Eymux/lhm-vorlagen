import { LhmVorlagenPage } from './app.po';

describe('lhm-vorlagen App', () => {
  let page: LhmVorlagenPage;

  beforeEach(() => {
    page = new LhmVorlagenPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
