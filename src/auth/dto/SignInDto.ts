import { IsBoolean, IsEmail, IsNotEmpty } from 'class-validator';
import { Trim } from '../../common/transforms';

export class SignInDto {
  @IsEmail()
  @Trim()
  email: string;
  @IsNotEmpty()
  @Trim()
  password: string;
  @IsBoolean()
  remember: boolean;
}
