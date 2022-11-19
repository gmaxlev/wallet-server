import { HttpException } from '@nestjs/common';

export class UserFriendlyException extends HttpException {
  constructor(message: string | string[], code = 400) {
    super(
      HttpException.createBody(
        {
          statusCode: code,
          userFriendly: true,
          message,
        },
        'some',
        code,
      ),
      code,
    );
  }
}
