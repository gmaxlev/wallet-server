import { Module } from '@nestjs/common';
import { UserService } from './user/user.service';

@Module({
  providers: [UserService]
})
export class UserModule {}
