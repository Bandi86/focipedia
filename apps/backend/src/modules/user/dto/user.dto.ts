import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail } from 'class-validator';

export class UserResponseDto {
  @ApiProperty({ description: 'User ID' })
  id!: string;

  @ApiProperty({ description: 'User email' })
  email!: string;

  @ApiProperty({ description: 'Username' })
  username!: string;

  @ApiProperty({ description: 'Display name' })
  displayName!: string;

  @ApiProperty({ description: 'User bio', required: false })
  bio?: string;

  @ApiProperty({ description: 'Avatar URL', required: false })
  avatarUrl?: string;

  @ApiProperty({ description: 'User verification status' })
  isVerified!: boolean;

  @ApiProperty({ description: 'Account creation date' })
  createdAt!: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt!: Date;
}

export class UpdateUserDto {
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
  @IsString()
  avatarUrl?: string;
}

export class ChangePasswordDto {
  @ApiProperty({ description: 'Current password' })
  @IsString()
  currentPassword!: string;

  @ApiProperty({ description: 'New password' })
  @IsString()
  newPassword!: string;
} 