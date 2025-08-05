import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: 'User email address', example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: 'User password', example: 'password123' })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ description: 'Username', example: 'johndoe' })
  @IsString()
  @MinLength(3)
  username!: string;

  @ApiProperty({ description: 'Display name', example: 'John Doe' })
  @IsString()
  @MinLength(2)
  displayName!: string;
}

export class LoginDto {
  @ApiProperty({ 
    description: 'User email address or username', 
    example: 'user@example.com or johndoe' 
  })
  @IsString()
  emailOrUsername!: string;

  @ApiProperty({ description: 'User password', example: 'password123' })
  @IsString()
  password!: string;
}

export class RefreshTokenDto {
  @ApiProperty({ description: 'Refresh token' })
  @IsString()
  refreshToken!: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ description: 'User email address', example: 'user@example.com' })
  @IsEmail()
  email!: string;
}

export class ResetPasswordDto {
  @ApiProperty({ description: 'Reset token' })
  @IsString()
  token!: string;

  @ApiProperty({ description: 'New password', example: 'newpassword123' })
  @IsString()
  @MinLength(8)
  password!: string;
}

export class VerifyEmailDto {
  @ApiProperty({ description: 'Email verification token' })
  @IsString()
  token!: string;
}

export class ResendVerificationDto {
  @ApiProperty({ description: 'User email address', example: 'user@example.com' })
  @IsEmail()
  email!: string;
}

export class AuthResponseDto {
  @ApiProperty({ description: 'Access token' })
  accessToken!: string;

  @ApiProperty({ description: 'Refresh token' })
  refreshToken!: string;

  @ApiProperty({ description: 'Token type', example: 'Bearer' })
  tokenType!: string;

  @ApiProperty({ description: 'Token expiration time in seconds' })
  expiresIn!: number;

  @ApiProperty({ description: 'User information' })
  user!: {
    id: string;
    email: string;
    username: string;
    displayName: string;
    isVerified: boolean;
  };
} 