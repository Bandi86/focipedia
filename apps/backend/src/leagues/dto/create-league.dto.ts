import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateLeagueDto {
  @IsString()
  name!: string;

  @IsString()
  country!: string;

  @IsOptional()
  @IsUrl({ require_protocol: false })
  logoUrl?: string;
}
