import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateLeagueDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsString()
  country!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({ require_protocol: false })
  logoUrl?: string;
}
