import { Inject, Injectable } from '@nestjs/common';
import * as i18n from 'i18next';
import { I18N_INSTANCE, I18N_ROOT_OPTIONS } from './constants';
import { I18nextRootOptions } from './types';

@Injectable()
export class I18nService {
  constructor(
    @Inject(I18N_INSTANCE) private readonly i18n: i18n.i18n,
    @Inject(I18N_ROOT_OPTIONS) public readonly options: I18nextRootOptions,
  ) {}

  t(lng: string | undefined, key: string, ns?: string) {
    let options: { lng: string; ns?: string } = {
      lng,
    };

    if (ns) {
      options = {
        ...options,
        ns,
      };
    }

    return this.i18n.t(key, options);
  }
}
