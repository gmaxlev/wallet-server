import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RefreshToken } from './entities/RefreshToken';
import { User } from './entities/User';
import { Account } from './entities/Account';
import { Currency } from './entities/Currency';
import { Category } from './entities/Category';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          synchronize: true,
          dropSchema: false,
          host: config.getOrThrow('DB_HOST'),
          port: config.getOrThrow('DB_PORT'),
          username: config.getOrThrow('DB_USERNAME'),
          password: config.getOrThrow('DB_PASSWORD'),
          database: config.getOrThrow('DB_DATABASE'),
          entities: [RefreshToken, User, Account, Currency, Category],
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
