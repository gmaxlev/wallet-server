import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SetRoles, UserRole } from '../../../user/roles';
import { InjectUser } from '../../../user/decorators';
import { UserRequest } from '../../../auth/types';
import { AccountService } from '../../account/account.service';
import { CreateAccountDto } from '../../dto/CreateAccountDto';
import {
  PaginateParams,
  PaginateParamsType,
} from '../../../pagination/decorators';
import { UpdateAccountDto } from '../../dto/UpdateAccountDto';
import { NotEmptyAccountsException } from '../../exceptions/NotEmptyAccountsException';
import { LocalizeException } from '../../../i18n/expeptions/LocalizeException';

@Controller('account')
@UsePipes(new ValidationPipe({ transform: true }))
@SetRoles(UserRole.USER)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get(':id')
  async find(
    @Param('id', ParseIntPipe) id: number,
    @InjectUser() user: UserRequest,
  ) {
    const account = await this.accountService.get(id);
    if (!account) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    } else if (account.user.id !== user.id) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return account;
  }

  @Get()
  findAll(
    @InjectUser() user: UserRequest,
    @PaginateParams() pagination: PaginateParamsType,
  ) {
    return this.accountService.getAll(pagination, user.id);
  }

  @Post()
  create(@InjectUser() user: UserRequest, @Body() body: CreateAccountDto) {
    return this.accountService.create(user.id, body);
  }

  @Put(':id')
  edit(
    @Param('id', ParseIntPipe) id: number,
    @InjectUser() user: UserRequest,
    @Body() body: UpdateAccountDto,
  ) {
    return this.accountService.update(id, user.id, body);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @InjectUser() user: UserRequest,
  ) {
    try {
      return await this.accountService.remove(id, user.id);
    } catch (e: unknown) {
      if (e instanceof NotEmptyAccountsException) {
        throw new LocalizeException('account:removeLastAccountError');
      }
      throw e;
    }
  }
}
