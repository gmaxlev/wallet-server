import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Ip,
  Post,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SignUpDto } from '../../dto/SignUpDto';
import { AuthService } from '../../auth/auth.service';
import { SignInDto } from '../../dto/SignInDto';
import { Response, Request, CookieOptions } from 'express';
import { ConfigService } from '@nestjs/config';
import { OnlyUnauthorized, SetRoles, UserRole } from '../../../user/roles';
import { JwtRefreshPayload, JwtTokenPayload } from '../../types';
import { UnauthorizedError } from '../../errors';
import { UserAgent } from '../../../common/decorators';
import { UserFriendlyException } from '../../../common/exceptions/UserFriendlyException';
import { LocalizeException } from '../../../i18n/expeptions/LocalizeException';

@Controller('auth')
@UsePipes(new ValidationPipe({ transform: true }))
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('sign-up')
  @OnlyUnauthorized()
  async signUp(@Req() req: Request, @Body() body: SignUpDto) {
    await this.authService.signUp(body);
  }

  @Post('sign-in')
  @OnlyUnauthorized()
  async signIn(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
    @Ip() ip: string,
    @UserAgent() agent: string | null,
    @Body() body: SignInDto,
  ) {
    const existedRefreshToken =
      req.cookies[this.configService.getOrThrow('COOKIE_REFRESH_TOKEN_NAME')];

    if (
      existedRefreshToken &&
      (await this.authService.isRefreshTokenValid(existedRefreshToken))
    ) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    try {
      const { token, refresh } = await this.authService.signIn({
        email: body.email,
        password: body.password,
        remember: body.remember,
        agent,
        ip,
      });

      this.saveTokenInCookie(
        res,
        'token',
        token.string,
        token.payload,
        body.remember,
      );

      this.saveTokenInCookie(
        res,
        'refresh',
        refresh.string,
        refresh.payload,
        body.remember,
      );
    } catch (e: unknown) {
      if (e instanceof UnauthorizedError) {
        throw new LocalizeException('auth:sign-in-error', 401);
      }
      throw e;
    }
  }

  @Post('refresh')
  @OnlyUnauthorized()
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @UserAgent() agent: string | null,
    @Ip() ip: string,
  ) {
    const cookieValue =
      req.cookies[this.configService.getOrThrow('COOKIE_REFRESH_TOKEN_NAME')];

    if (!cookieValue) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    try {
      const { token, refresh } = await this.authService.refresh(
        cookieValue,
        agent,
        ip,
      );

      this.saveTokenInCookie(res, 'token', token.string, token.payload, true);
      this.saveTokenInCookie(
        res,
        'refresh',
        refresh.string,
        refresh.payload,
        true,
      );
    } catch (e: unknown) {
      if (e instanceof UnauthorizedError) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
      throw e;
    }
  }

  @Post('logout')
  @SetRoles(UserRole.USER)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const tokenName = this.configService.getOrThrow('COOKIE_TOKEN_NAME');
    const refreshName = this.configService.getOrThrow(
      'COOKIE_REFRESH_TOKEN_NAME',
    );

    const token = req.cookies[tokenName];
    const refresh = req.cookies[refreshName];

    if (!token && !refresh) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    try {
      await this.authService.logout(refresh);
      res.clearCookie(tokenName);
      res.clearCookie(refreshName);
    } catch (e: unknown) {
      if (e instanceof UnauthorizedError) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
      throw e;
    }
  }

  saveTokenInCookie(
    res: Response,
    type: 'token' | 'refresh',
    string: string,
    payload: JwtTokenPayload | JwtRefreshPayload,
    remember: boolean,
  ): void {
    const configKey = this.configService.getOrThrow(
      type === 'token' ? 'COOKIE_TOKEN_NAME' : 'COOKIE_REFRESH_TOKEN_NAME',
    );

    let params: CookieOptions = {
      httpOnly: true,
    };

    if (remember) {
      params = {
        ...params,
        maxAge: (payload.exp - payload.iat) * 1000,
      };
    }

    res.cookie(configKey, string, params);
  }
}
