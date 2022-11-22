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
import { CategoryService } from '../../category/category.service';
import {
  PaginateParams,
  PaginateParamsType,
} from '../../../pagination/decorators';
import { CreateCategoryDto } from '../../dto/CreateCategoryDto';

@Controller('category')
@UsePipes(new ValidationPipe({ transform: true }))
@SetRoles(UserRole.USER)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@InjectUser() user: UserRequest, @Body() body: CreateCategoryDto) {
    return this.categoryService.create(user.id, body);
  }

  @Put(':id')
  update(
    @InjectUser() user: UserRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateCategoryDto,
  ) {
    return this.categoryService.update(user.id, id, body);
  }

  @Delete(':id')
  remove(
    @InjectUser() user: UserRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.categoryService.remove(user.id, id);
  }

  @Get(':id')
  async get(
    @InjectUser() user: UserRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const category = await this.categoryService.get(id);
    if (!category) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    if (category.user.id !== user.id) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return category;
  }

  @Get()
  getAllPaginated(
    @InjectUser() user: UserRequest,
    @PaginateParams() pagination: PaginateParamsType,
  ) {
    return this.categoryService.getAllPaginated(user.id, pagination);
  }
}
