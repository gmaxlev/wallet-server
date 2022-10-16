import { IsEmail, IsNotEmpty } from 'class-validator';
import { Trim } from '../../common/transforms';

export class CheckCredentialsDto {
  @IsEmail()
  @Trim()
  email: string;
  @IsNotEmpty()
  @Trim()
  password: string;
}
