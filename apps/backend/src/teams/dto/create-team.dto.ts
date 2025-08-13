import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUrl, Min } from 'class-validator';

export class CreateTeamDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsString()
  country!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  stadium?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({ require_protocol: false })
  logoUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1800)
  founded?: number;
}
