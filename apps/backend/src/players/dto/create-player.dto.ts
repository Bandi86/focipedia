import { IsDateString, IsEnum, IsInt, IsOptional, IsString, IsUrl } from 'class-validator';
import { PlayerPosition } from '@prisma/client';

export class CreatePlayerDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsString()
  nationality!: string;

  @IsEnum(PlayerPosition)
  position!: PlayerPosition;

  @IsOptional()
  @IsInt()
  jerseyNumber?: number;

  @IsOptional()
  @IsUrl({ require_protocol: false })
  imageUrl?: string;

  @IsInt()
  teamId!: number;
}
