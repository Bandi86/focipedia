import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { $Enums } from '@prisma/client';

export class CreateMatchEventDto {
  @IsInt()
  @Min(0)
  minute!: number;

  @IsEnum($Enums.MatchEventType)
  type!: $Enums.MatchEventType;

  @IsInt()
  matchId!: number;

  @IsInt()
  playerId!: number;

  @IsOptional()
  @IsInt()
  assistingPlayerId?: number;

  @IsOptional()
  @IsInt()
  playerInId?: number;

  @IsOptional()
  @IsInt()
  playerOutId?: number;
}
