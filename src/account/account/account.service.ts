import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Account } from '../../database/entities/Account';
import { User } from '../../database/entities/User';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>,
    private dataSource: DataSource,
  ) {}

  createDefaultAccount() {
    const account = new Account();
    account.name = 'Cash';
    account.description = 'Some text';
    account.isMain = true;
    return account;
  }
}
