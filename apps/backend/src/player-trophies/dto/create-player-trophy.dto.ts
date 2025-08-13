import { IsInt, IsString } from 'class-validator';

export class CreatePlayerTrophyDto {
  @IsString()
  season!: string;

  @IsInt()
  playerId!: number;

  @IsInt()
  trophyId!: number;
}
