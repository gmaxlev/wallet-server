import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError, pipe } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { I18nService } from '../i18n.service';
import { LocalizeException } from '../expeptions/LocalizeException';
import { UserFriendlyException } from '../../common/exceptions/UserFriendlyException';
import { Request } from 'express';

@Injectable()
export class LocalizeExceptionInterceptor implements NestInterceptor {
  constructor(private readonly i18nService: I18nService) {}

  parse(lng: string | undefined, message: string | string[]) {
    if (Array.isArray(message)) {
      return message.map((item) => this.i18nService.t(lng, item));
    }
    return this.i18nService.t(lng, message);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest() as Request;

    return next.handle().pipe(
      catchError((err) => {
        if (err instanceof LocalizeException) {
          return throwError(
            () =>
              new UserFriendlyException(
                this.parse(
                  request.headers.language as string,
                  err['response'].message,
                ),
                err['response'].statusCode,
              ),
          );
        }
        return throwError(() => err);
      }),
    );
  }
}
