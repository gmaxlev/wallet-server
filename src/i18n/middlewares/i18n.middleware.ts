import { Injectable, NestMiddleware } from '@nestjs/common';
import { I18nService } from '../i18n.service';
import { Request } from 'express';

@Injectable()
export class I18nMiddleware implements NestMiddleware {
  constructor(private readonly i18nService: I18nService) {}

  use(req: Request, res: any, next: () => void) {
    req.i18n = {
      service: this.i18nService,
      lng: req.headers.language
        ? String(req.headers.language)
        : this.i18nService.options.fallbackLng,
    };
    next();
  }
}
