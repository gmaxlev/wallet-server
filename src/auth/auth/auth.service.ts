import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignUpDto } from '../dto/SignUpDto';
import { UserService } from '../../user/user/user.service';
import { SignInDto } from '../dto/SignInDto';
import { DataSource, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from '../../database/entities/RefreshToken';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IssuedTokens,
  JwtRefreshPayload,
  JwtRefreshPayloadUser,
  JwtTokenPayload,
  JwtTokenPayloadUser,
} from '../types';
import { User } from '../../database/entities/User';
import { DuplicateToken, UnauthorizedError } from '../errors';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private userService: UserService,
    private dataSource: DataSource,
    private jwtService: JwtService,
  ) {}

  async signUp({ email, password }: SignUpDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    let result;

    try {
      result = await this.userService.create(
        { email, password },
        queryRunner.manager,
      );
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    return result;
  }

  async signIn({
    email,
    password,
    agent,
    ip,
    remember,
  }: SignInDto & { agent: string | null; ip: string }) {
    const user = await this.userService.getUserByCredentials({
      email,
      password,
    });

    if (!user) {
      throw new UnauthorizedError('Wrong credentials');
    }

    return this.issueToken(user, agent, ip, remember);
  }

  async refresh(refreshToken, agent, ip): Promise<IssuedTokens> {
    const jwtRefreshPayload = await (async () => {
      try {
        return await this.jwtService.verifyAsync<JwtRefreshPayload>(
          refreshToken,
        );
      } catch (err) {
        throw new UnauthorizedError('Wrong refresh token');
      }
    })();

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    let result;

    try {
      const token = await queryRunner.manager.findOne(RefreshToken, {
        where: {
          refresh: refreshToken,
        },
        relations: ['user'],
      });

      if (!token) {
        throw new UnauthorizedError('Refresh token has been removed');
      }

      await queryRunner.manager.remove(RefreshToken, token);

      result = await this.issueToken(
        token.user,
        agent,
        ip,
        jwtRefreshPayload.remember,
        queryRunner.manager,
      );

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }

    return result;
  }

  async issueToken(
    user: User,
    agent: string,
    ip: string,
    remember: boolean,
    entityManager = this.dataSource.manager,
  ): Promise<IssuedTokens> {
    const tokenString = await this.jwtService.signAsync({
      id: user.id,
      roles: user.roles,
    } as JwtTokenPayloadUser);

    const exist = await entityManager.findOneBy(RefreshToken, {
      token: tokenString,
    });

    if (exist) {
      throw new DuplicateToken('A token has been already created');
    }

    const refreshString = await this.jwtService.signAsync(
      {
        id: user.id,
        remember,
      } as JwtRefreshPayloadUser,
      {
        expiresIn: '10m',
      },
    );

    const decodedToken = this.jwtService.decode(tokenString) as JwtTokenPayload;

    const decodedRefresh = this.jwtService.decode(
      refreshString,
    ) as JwtRefreshPayload;

    const refreshToken = new RefreshToken();
    refreshToken.user = user;
    refreshToken.token = tokenString;
    refreshToken.refresh = refreshString;
    refreshToken.exp = decodedRefresh.exp;
    refreshToken.agent = agent ? agent : null;
    refreshToken.ip = ip;

    await entityManager.save(refreshToken);

    return {
      token: {
        string: tokenString,
        payload: decodedToken,
      },
      refresh: {
        string: refreshString,
        payload: decodedRefresh,
      },
    };
  }

  async logout(refreshToken): Promise<void> {
    const token = await this.refreshTokenRepository.findOneBy({
      refresh: refreshToken,
    });

    if (!token) {
      throw new UnauthorizedError('Refresh token do not exist');
    }

    await this.refreshTokenRepository.remove(token);
  }

  async isRefreshTokenValid(refreshToken) {
    try {
      await this.jwtService.verifyAsync<JwtRefreshPayload>(refreshToken);
      return true;
    } catch (err) {
      return false;
    }
  }
}
