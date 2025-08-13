import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsIn, IsInt, IsOptional, IsString, IsUrl } from 'class-validator';
import { $Enums } from '@prisma/client';

const PLAYER_POSITIONS = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'] as const;

export class CreatePlayerDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiProperty()
  @IsString()
  nationality!: string;

  @ApiProperty({ enum: PLAYER_POSITIONS })
  @IsIn(PLAYER_POSITIONS as unknown as string[])
  position!: $Enums.PlayerPosition;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  jerseyNumber?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({ require_protocol: false })
  imageUrl?: string;

  @ApiProperty()
  @IsInt()
  teamId!: number;
}
