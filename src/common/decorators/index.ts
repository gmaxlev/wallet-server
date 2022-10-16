import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const UserAgent = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest() as Request;
    const header =
      req.headers &&
      req.headers['user-agent'] &&
      req.headers['user-agent'].trim();

    return header ? header : null;
  },
);
