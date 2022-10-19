import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { AuthController } from './controllers/auth/auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from '../database/entities/RefreshToken';
import { UserModule } from '../user/user.module';
import { AuthGuard } from './guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow('JWT_SECRET'),
        signOptions: {
          expiresIn: '10s',
        },
      }),
    }),
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([RefreshToken]),
    ConfigModule,
  ],
  providers: [
    AuthService,
    AuthGuard,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [AuthController],
  exports: [AuthGuard, JwtModule],
})
export class AuthModule {}
