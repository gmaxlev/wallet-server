import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtTokenPayload, UserRequest } from '../types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async use(req: Request, res: any, next: () => void) {
    let user: UserRequest | null = null;

    const cookieName = this.configService.getOrThrow('COOKIE_TOKEN_NAME');

    if (req.cookies[cookieName]) {
      try {
        const payload = await this.jwtService.verifyAsync<JwtTokenPayload>(
          req.cookies[cookieName],
        );

        user = {
          id: payload.id,
          roles: payload.roles,
        };
      } catch (err) {}
    }

    req.user = user;

    next();
  }
}
