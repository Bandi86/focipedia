import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl } from 'class-validator';

export class ProfileResponseDto {
  @ApiProperty({ description: 'Profile ID' })
  id!: string;

  @ApiProperty({ description: 'User ID' })
  userId!: string;

  @ApiProperty({ description: 'Username' })
  username!: string;

  @ApiProperty({ description: 'Display name' })
  displayName!: string;

  @ApiProperty({ description: 'User bio', required: false })
  bio?: string;

  @ApiProperty({ description: 'Avatar URL', required: false })
  avatarUrl?: string;

  @ApiProperty({ description: 'Profile creation date' })
  createdAt!: Date;

  @ApiProperty({ description: 'Profile last update date' })
  updatedAt!: Date;
}

export class UpdateProfileDto {
  @ApiProperty({ description: 'Display name', required: false })
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiProperty({ description: 'User bio', required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ description: 'Avatar URL', required: false })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}

export class PublicProfileResponseDto {
  @ApiProperty({ description: 'Username' })
  username!: string;

  @ApiProperty({ description: 'Display name' })
  displayName!: string;

  @ApiProperty({ description: 'User bio', required: false })
  bio?: string;

  @ApiProperty({ description: 'Avatar URL', required: false })
  avatarUrl?: string;

  @ApiProperty({ description: 'Profile creation date' })
  createdAt!: Date;
} 