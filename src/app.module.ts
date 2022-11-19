import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthMiddleware } from './auth/middlewares/auth.middleware';
import { AccountModule } from './account/account.module';
import { PaginationModule } from './pagination/pagination.module';
import { I18nModule } from './i18n/i18n.module';
import { CurrencyModule } from './currency/currency.module';
import * as path from 'path';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UserModule,
    ConfigModule,
    AccountModule,
    PaginationModule,
    I18nModule.forRoot({
      fallbackLng: 'en',
      resourcesPath: path.join(process.cwd(), '/src/locales'),
    }),
    CurrencyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
