import { IsInt, IsOptional, IsString, IsUrl, Min } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  name!: string;

  @IsString()
  country!: string;

  @IsOptional()
  @IsString()
  stadium?: string;

  @IsOptional()
  @IsUrl({ require_protocol: false })
  logoUrl?: string;

  @IsOptional()
  @IsInt()
  @Min(1800)
  founded?: number;
}
