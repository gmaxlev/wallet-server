import { Controller, Get, Post } from '@nestjs/common';
import { CurrencyService } from '../../currency/currency.service';

@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get()
  getAll() {
    return this.currencyService.getAll();
  }

  @Post()
  seed() {
    return this.currencyService.seed();
  }
}
