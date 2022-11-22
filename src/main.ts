import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

(async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://192.168.100.87:3001',
      'http://192.168.149.59:3001',
      'http://192.168.239.59:3001',
      'http://192.168.100.87:63348',
    ],
    credentials: true,
  });
  await app.listen(3000);
})();
