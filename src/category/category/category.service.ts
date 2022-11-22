import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../../database/entities/Category';
import { DataSource, Repository } from 'typeorm';
import { PaginationService } from '../../pagination/pagination/pagination.service';
import { PaginateParamsType } from '../../pagination/decorators';
import { CreateCategoryDto } from '../dto/CreateCategoryDto';
import { UserService } from '../../user/user/user.service';
import { UpdateCategoryDto } from '../dto/UpdateCategoryDto';
import { ResourceNotFoundException } from '../../exceptions/ResourceNotFoundException';

@Injectable()
export class CategoryService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly paginationService: PaginationService,
    private readonly userService: UserService,
  ) {}

  async create(
    owner: number,
    data: CreateCategoryDto,
    entityManager = this.dataSource.manager,
  ) {
    const category = new Category();
    category.name = data.name;
    category.description = data.description;
    category.user = await this.userService.get(owner, entityManager);
    return entityManager.save(category);
  }

  async update(
    owner: number,
    id: number,
    data: UpdateCategoryDto,
    entityManager = this.dataSource.manager,
  ) {
    const category = await entityManager.findOneBy(Category, {
      id,
      user: {
        id: owner,
      },
    });

    if (!category) {
      throw new ResourceNotFoundException();
    }

    category.name = data.name;
    category.description = data.description;

    return entityManager.save(category);
  }

  async remove(
    owner: number,
    id: number,
    entityManager = this.dataSource.manager,
  ) {
    const category = await entityManager.findOneBy(Category, {
      id,
      user: {
        id: owner,
      },
    });

    if (!category) {
      throw new ResourceNotFoundException();
    }

    return entityManager.remove(category);
  }

  get(id: number, entityManager = this.dataSource.manager) {
    return entityManager.findOne(Category, {
      where: {
        id,
      },
      relations: ['user'],
    });
  }

  async getAllPaginated(
    owner: number,
    pagination: PaginateParamsType,
    entityManager = this.dataSource.manager,
  ) {
    return this.paginationService.withPagination(
      pagination,
      await entityManager.findAndCount(Category, {
        where: {
          user: {
            id: owner,
          },
        },
        take: pagination.take,
        skip: pagination.skip,
        order: {
          createdAt: 'DESC',
        },
      }),
    );
  }
}
