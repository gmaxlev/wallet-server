import { Injectable } from '@nestjs/common';
import { PaginateParamsType } from '../decorators';

export interface WithPagination<D> {
  page: number;
  take: number;
  total: number;
  isFinish: boolean;
  rest: number;
  data: D;
}

@Injectable()
export class PaginationService {
  withPagination<D>(
    pagination: PaginateParamsType,
    dataAndTotal: [D, number],
  ): WithPagination<D>;

  withPagination<D>(
    pagination: PaginateParamsType,
    total: number,
    data: D,
  ): WithPagination<D>;

  public withPagination<D>(
    pagination: PaginateParamsType,
    param2: [D, number] | number,
    param3?: D,
  ): WithPagination<D> {
    let total;
    let data;

    if (Array.isArray(param2)) {
      data = param2[0];
      total = param2[1];
    } else {
      total = param2;
      data = param3;
    }

    const current = Math.min(total, pagination.page * pagination.take);

    return {
      page: pagination.page,
      take: pagination.take,
      total,
      isFinish: current === total,
      rest: total - current,
      data,
    };
  }
}
