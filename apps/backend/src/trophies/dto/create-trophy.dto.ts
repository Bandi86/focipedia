import { IsInt, IsString } from 'class-validator';

export class CreateTrophyDto {
  @IsString()
  name!: string;

  @IsString()
  type!: string;

  @IsInt()
  year!: number;
}
