import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Account } from '../../database/entities/Account';
import { CreateAccountDto } from '../dto/CreateAccountDto';
import { User } from '../../database/entities/User';
import { PaginateParamsType } from '../../pagination/decorators';
import { PaginationService } from '../../pagination/pagination/pagination.service';
import { Currency } from '../../database/entities/Currency';
import { ResourceNotFoundException } from '../../exceptions/ResourceNotFoundException';
import { UpdateAccountDto } from '../dto/UpdateAccountDto';
import { NotEmptyAccountsException } from '../exceptions/NotEmptyAccountsException';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
    private readonly dataSource: DataSource,
    private readonly paginationService: PaginationService,
  ) {}

  /**
   * Creates the first account during creating account
   * @todo create separate method for getting the default currency
   * @todo to localize name field
   */
  async createFirstAccount(entityManager = this.dataSource.manager) {
    const account = new Account();
    account.name = 'Cash';
    account.description = 'Some text';
    account.balance = 0;
    account.currency = (await entityManager.find(Currency))[0];

    return account;
  }

  /**
   * Creates an account
   */
  async create(
    userId: number,
    { name, description, initialValue, currencyId }: CreateAccountDto,
    entityManager = this.dataSource.manager,
  ) {
    const currency = await entityManager.findOne(Currency, {
      where: {
        id: currencyId,
      },
    });

    if (!currency) {
      throw new Error('Currency do not exist');
    }

    const account = new Account();
    account.name = name;
    account.description = description;
    account.balance = initialValue;
    account.currency = currency;
    account.user = {
      id: userId,
    } as User;
    return entityManager.save(account);
  }

  /**
   * Returns an account by id
   */
  get(id, entityManager = this.dataSource.manager) {
    return entityManager.findOne(Account, {
      where: {
        id,
      },
      relations: ['user', 'currency'],
    });
  }

  /**
   * Returns paginated accounts
   */
  async getAll(
    pagination: PaginateParamsType,
    userId: number,
    entityManager = this.dataSource.manager,
  ) {
    return this.paginationService.withPagination(
      pagination,
      await entityManager.findAndCount(Account, {
        where: {
          user: {
            id: userId,
          },
        },
        relations: ['currency'],
        take: pagination.take,
        skip: pagination.skip,
        order: {
          createdAt: 'DESC',
        },
      }),
    );
  }

  /**
   * Updates an account
   */
  async update(
    id: number,
    owner: number,
    { name, description, balance, currencyId }: UpdateAccountDto,
    entityManager = this.dataSource.manager,
  ) {
    const account = await entityManager.findOne(Account, {
      where: {
        id: id,
        user: {
          id: owner,
        },
      },
      relations: ['currency'],
    });

    if (!account) {
      throw new ResourceNotFoundException();
    }

    account.name = name;
    account.description = description;
    account.balance = balance;
    account.currency = await entityManager.findOneBy(Currency, {
      id: currencyId,
    });

    return entityManager.save(account);
  }

  /**
   * Removes an account
   */
  async remove(
    id: number,
    owner: number,
    entityManager = this.dataSource.manager,
  ) {
    const count = await this.getAccountsCount(owner);

    if (count === 1) {
      throw new NotEmptyAccountsException();
    }

    const account = await entityManager.findOneBy(Account, {
      id,
      user: {
        id: owner,
      },
    });

    if (!account) {
      throw new ResourceNotFoundException();
    }

    return entityManager.remove(account);
  }

  /**
   * Returns accounts count
   */
  getAccountsCount(owner: number, entityManager = this.dataSource.manager) {
    return entityManager.countBy(Account, {
      user: {
        id: owner,
      },
    });
  }
}
