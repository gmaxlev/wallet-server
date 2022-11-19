import {
  DynamicModule,
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { I18nextRootOptions } from './types';
import { I18N_INSTANCE, I18N_ROOT_OPTIONS } from './constants';
import { I18nService } from './i18n.service';
import * as i18n from 'i18next';
import { parseLocalesDirectory } from './utils';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LocalizeExceptionInterceptor } from './interceptors/localize-exception.interceptor';
import { I18nMiddleware } from './middlewares/i18n.middleware';

@Global()
@Module({})
export class I18nModule implements NestModule {
  static forRoot(options: I18nextRootOptions): DynamicModule {
    return {
      module: I18nModule,
      providers: [
        {
          provide: I18N_ROOT_OPTIONS,
          useValue: options,
        },
        {
          provide: I18N_INSTANCE,
          async useFactory() {
            await i18n.init({
              fallbackLng: options.fallbackLng,
            });

            const list = await parseLocalesDirectory(options.resourcesPath);

            for (const item of list) {
              await (i18n as any).addResourceBundle(
                item.lng,
                item.namespace,
                item.content,
              );
            }

            return i18n;
          },
        },
        {
          provide: APP_INTERCEPTOR,
          useClass: LocalizeExceptionInterceptor,
        },
        I18nService,
      ],
      exports: [I18nService],
    };
  }
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(I18nMiddleware).forRoutes('*');
  }
}
