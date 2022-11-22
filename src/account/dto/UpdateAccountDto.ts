import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { Trim } from '../../common/transforms';

export class UpdateAccountDto {
  @IsNotEmpty()
  @Trim()
  name: string;

  @IsString()
  @Trim()
  description: string;

  @IsNumber()
  @Min(0)
  @Trim()
  balance: number;

  @IsNumber()
  @Trim()
  currencyId: number;
}
