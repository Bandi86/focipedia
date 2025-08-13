import { IsInt, IsNumber, IsString } from 'class-validator';

export class CreateOddDto {
  @IsString()
  provider!: string;

  @IsNumber()
  homeWinOdds!: number;

  @IsNumber()
  drawOdds!: number;

  @IsNumber()
  awayWinOdds!: number;

  @IsInt()
  matchId!: number;
}
