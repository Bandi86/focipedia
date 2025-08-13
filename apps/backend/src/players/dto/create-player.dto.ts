import { IsDateString, IsIn, IsInt, IsOptional, IsString, IsUrl } from 'class-validator';
import { $Enums } from '@prisma/client';

const PLAYER_POSITIONS = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'] as const;

export class CreatePlayerDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsString()
  nationality!: string;

  @IsIn(PLAYER_POSITIONS as unknown as string[])
  position!: $Enums.PlayerPosition;

  @IsOptional()
  @IsInt()
  jerseyNumber?: number;

  @IsOptional()
  @IsUrl({ require_protocol: false })
  imageUrl?: string;

  @IsInt()
  teamId!: number;
}
