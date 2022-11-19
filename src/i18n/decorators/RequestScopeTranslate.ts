import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export type RequestTranslateType = (key: string, ns?: string) => string;

export const RequestTranslate = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const i18n = (ctx.switchToHttp().getRequest() as Request).i18n;
    return function t(key, ns) {
      return i18n.service.t(i18n.lng, key, ns);
    };
  },
);
