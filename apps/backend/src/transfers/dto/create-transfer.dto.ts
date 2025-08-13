import { IsDateString, IsEnum, IsInt, IsNumber, IsOptional } from 'class-validator';
import { $Enums } from '@prisma/client';

export class CreateTransferDto {
  @IsDateString()
  transferDate!: string;

  @IsOptional()
  @IsNumber()
  transferFee?: number;

  @IsEnum($Enums.TransferType)
  transferType!: $Enums.TransferType;

  @IsInt()
  playerId!: number;

  @IsOptional()
  @IsInt()
  fromTeamId?: number;

  @IsInt()
  toTeamId!: number;
}
