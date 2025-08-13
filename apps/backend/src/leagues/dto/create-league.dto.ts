import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, IsUrl } from 'class-validator';

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

  @ApiPropertyOptional({ enum: ['DomesticLeague', 'DomesticCup', 'InternationalClub', 'InternationalNational'] })
  @IsOptional()
  @IsIn(['DomesticLeague', 'DomesticCup', 'InternationalClub', 'InternationalNational'])
  competitionType?: 'DomesticLeague' | 'DomesticCup' | 'InternationalClub' | 'InternationalNational';
}
