import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsIn } from 'class-validator';

export class SettingsResponseDto {
  @ApiProperty({ description: 'Settings ID' })
  id!: string;

  @ApiProperty({ description: 'User ID' })
  userId!: string;

  @ApiProperty({ description: 'Theme preference', example: 'light' })
  theme!: string;

  @ApiProperty({ description: 'Notifications enabled', example: true })
  notificationsEnabled!: boolean;

  @ApiProperty({ description: 'Privacy level', example: 'public' })
  privacyLevel!: string;

  @ApiProperty({ description: 'Settings creation date' })
  createdAt!: Date;

  @ApiProperty({ description: 'Settings last update date' })
  updatedAt!: Date;
}

export class UpdateSettingsDto {
  @ApiProperty({ description: 'Theme preference', required: false, enum: ['light', 'dark'] })
  @IsOptional()
  @IsString()
  @IsIn(['light', 'dark'])
  theme?: string;

  @ApiProperty({ description: 'Notifications enabled', required: false })
  @IsOptional()
  @IsBoolean()
  notificationsEnabled?: boolean;

  @ApiProperty({ description: 'Privacy level', required: false, enum: ['public', 'private', 'friends'] })
  @IsOptional()
  @IsString()
  @IsIn(['public', 'private', 'friends'])
  privacyLevel?: string;
} 