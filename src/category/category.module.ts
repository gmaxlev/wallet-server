import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../database/entities/Category';
import { CategoryService } from './category/category.service';
import { CategoryController } from './controllers/category/category.controller';
import { PaginationModule } from '../pagination/pagination.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), PaginationModule, UserModule],
  providers: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
