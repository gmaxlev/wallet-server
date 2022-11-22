import { Controller, Get } from '@nestjs/common';
import { SetRoles, UserRole } from '../../roles';
import { InjectUser } from '../../decorators';
import { UserRequest } from '../../../auth/types';
import { UserService } from '../../user/user.service';

@Controller('user')
@SetRoles(UserRole.USER)
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  get(@InjectUser() user: UserRequest) {
    return this.userService.get(user.id);
  }
}
