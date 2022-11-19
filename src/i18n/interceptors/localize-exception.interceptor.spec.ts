import { LocalizeExceptionInterceptor } from './localize-exception.interceptor';

describe('LocalizeException', () => {
  it('should be defined', () => {
    expect(new LocalizeExceptionInterceptor()).toBeDefined();
  });
});
