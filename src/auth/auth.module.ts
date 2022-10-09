import { Module } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import {AuthController} from "./controllers/auth/auth.controller";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";

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
  ],
  providers: [AuthService],
  controllers: [AuthController],

})
export class AuthModule {}
