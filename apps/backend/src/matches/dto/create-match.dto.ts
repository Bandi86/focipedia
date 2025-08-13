import { IsBoolean, IsDateString, IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { $Enums } from '@prisma/client';

const MATCH_STATUS = [
  'Scheduled',
  'Live',
  'Finished',
  'Canceled',
  'Postponed',
  'Suspended',
] as const;

export class CreateMatchDto {
  @IsDateString()
  matchDate!: string;

  @IsOptional()
  @IsString()
  stadium?: string;

  @IsOptional()
  @IsString()
  round?: string;

  @IsOptional()
  @IsBoolean()
  isCup?: boolean;

  @IsIn(MATCH_STATUS as unknown as string[])
  status!: $Enums.MatchStatus;

  @IsInt()
  homeTeamId!: number;

  @IsInt()
  awayTeamId!: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  homeScore?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  awayScore?: number;

  @IsInt()
  leagueId!: number;
}
