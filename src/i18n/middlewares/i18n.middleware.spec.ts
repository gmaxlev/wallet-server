import { I18nMiddleware } from './i18n.middleware';

describe('I18nMiddleware', () => {
  it('should be defined', () => {
    expect(new I18nMiddleware()).toBeDefined();
  });
});
