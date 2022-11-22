import { IsNotEmpty, IsString } from 'class-validator';
import { Trim } from '../../common/transforms';

export class UpdateCategoryDto {
  @IsNotEmpty()
  @Trim()
  name: string;

  @IsString()
  @Trim()
  description: string;
}
