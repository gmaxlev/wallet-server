import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { Trim } from '../../common/transforms';

export class CreateAccountDto {
  @IsNotEmpty()
  @Trim()
  name: string;

  @IsString()
  @Trim()
  description: string;

  @IsNumber()
  @Min(0)
  @Trim()
  initialValue: number;

  @IsNumber()
  @Trim()
  currencyId: number;
}
