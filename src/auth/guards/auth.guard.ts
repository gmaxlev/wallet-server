import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { onlyUnauthorizedKey, rolesMetadataKey } from '../../user/roles';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest() as Request;

    const onlyUnauthorizedMetadata = this.reflector.getAllAndOverride(
      onlyUnauthorizedKey,
      [context.getHandler(), context.getClass()],
    );

    if (onlyUnauthorizedMetadata) {
      return !user;
    }

    const rolesMetadata = this.reflector.getAllAndOverride(rolesMetadataKey, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!rolesMetadata || !rolesMetadata.length) {
      return true;
    }

    if (!user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    for (let i = 0; i < rolesMetadata.length; i++) {
      if (user.roles.indexOf(rolesMetadata[i]) === -1) {
        return false;
      }
    }

    return true;
  }
}
