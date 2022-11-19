import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { isInt, isPositive } from 'class-validator';

export interface PaginateParamsType {
  page: number;
  take: number;
  skip: number;
}

export interface PaginateConfig {
  take: number;
}

export const paginatedMetadataKey = Symbol('paginatedMetadataKey');

export const PaginateParams = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const { query } = ctx.switchToHttp().getRequest() as Request;

    let defaultTake = 100;

    const methodMetadata = Reflect.getMetadata(
      paginatedMetadataKey,
      ctx.getHandler(),
    );

    if (methodMetadata) {
      defaultTake = (methodMetadata as PaginateConfig).take;
    } else {
      const classMetadata = Reflect.getMetadata(
        paginatedMetadataKey,
        ctx.getClass(),
      );

      if (classMetadata) {
        defaultTake = (classMetadata as PaginateConfig).take;
      }
    }

    let { page = 1, take = defaultTake } = query;

    page = Number(page);
    take = Number(take);
    page = isPositive(page) && isInt(page) ? page : 1;
    take = isPositive(take) && isInt(take) ? take : 1;

    return {
      page,
      take,
      skip: (page - 1) * take,
    };
  },
);
