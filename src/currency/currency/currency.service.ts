import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Currency } from '../../database/entities/Currency';
import { DataSource, Repository } from 'typeorm';
import { map } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class CurrencyService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  getAll() {
    return this.currencyRepository.find();
  }

  async seed() {
    const existing = await this.currencyRepository.find();
    if (existing.length) {
      return;
    }

    const list = await lastValueFrom(
      this.httpService
        .get<{ currencies: Record<string, string> }>(
          'https://api.apilayer.com/currency_data/list',
          {
            headers: {
              apikey: this.configService.getOrThrow('APILAYER_KEY'),
            },
          },
        )
        .pipe(
          map(({ data }) => {
            return data.currencies;
          }),
        ),
    );

    for (const code in list) {
      const currency = new Currency();
      currency.code = code;
      currency.description = list[code];
      await this.dataSource.manager.save(Currency, currency);
    }
  }
}
