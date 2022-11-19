import { I18nService } from './i18n.service';

export interface I18nextRootOptions {
  fallbackLng: string;
  resourcesPath: string;
}

export interface I18nextRequest {
  service: I18nService;
  lng: string;
}

declare global {
  namespace Express {
    export interface Request {
      i18n: I18nextRequest;
    }
  }
}
