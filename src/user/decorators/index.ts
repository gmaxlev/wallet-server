import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Returns {@link UserRequest} or null
 */
export const InjectUser = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    return ctx.switchToHttp().getRequest().user;
  },
);
