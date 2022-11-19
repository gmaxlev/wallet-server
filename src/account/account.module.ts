import { Module } from '@nestjs/common';
import { AccountService } from './account/account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../database/entities/Account';
import { AccountController } from './controllers/account/account.controller';
import { PaginationModule } from '../pagination/pagination.module';
import { Currency } from '../database/entities/Currency';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Currency]), PaginationModule],
  providers: [AccountService],
  controllers: [AccountController],
  exports: [AccountService],
})
export class AccountModule {}
