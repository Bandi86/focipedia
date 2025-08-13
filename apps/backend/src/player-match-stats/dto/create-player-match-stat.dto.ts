import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class CreatePlayerMatchStatDto {
  @IsInt()
  @Min(0)
  minutesPlayed!: number;

  @IsInt()
  @Min(0)
  goals!: number;

  @IsInt()
  @Min(0)
  assists!: number;

  @IsInt()
  @Min(0)
  shots!: number;

  @IsInt()
  @Min(0)
  shotsOnTarget!: number;

  @IsInt()
  @Min(0)
  passes!: number;

  @IsOptional()
  @IsNumber()
  passAccuracy?: number;

  @IsInt()
  @Min(0)
  tackles!: number;

  @IsInt()
  @Min(0)
  interceptions!: number;

  @IsInt()
  @Min(0)
  dribbles!: number;

  @IsInt()
  @Min(0)
  foulsCommitted!: number;

  @IsInt()
  @Min(0)
  foulsSuffered!: number;

  @IsInt()
  @Min(0)
  yellowCards!: number;

  @IsInt()
  @Min(0)
  redCards!: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  saves?: number;

  @IsOptional()
  @IsNumber()
  expectedGoals?: number;

  @IsOptional()
  @IsNumber()
  expectedAssists?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  keyPasses?: number;

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsInt()
  playerId!: number;

  @IsInt()
  matchId!: number;
}
