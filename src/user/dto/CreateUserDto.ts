import { IsEmail, IsNotEmpty } from 'class-validator';
import { Trim } from '../../common/transforms';

export class CreateUserDto {
  @IsEmail()
  @Trim()
  email: string;
  @IsNotEmpty()
  @Trim()
  password: string;

  @IsNotEmpty()
  @Trim()
  name: string;
}
