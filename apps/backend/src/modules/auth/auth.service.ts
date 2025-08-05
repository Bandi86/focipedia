import { Injectable, UnauthorizedException, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { PrismaClient } from '@prisma/client';

import { RegisterDto, LoginDto, RefreshTokenDto, AuthResponseDto, ForgotPasswordDto, ResetPasswordDto, VerifyEmailDto, ResendVerificationDto } from './dto/auth.dto';
import { EmailService } from './email.service';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  private prisma: PrismaClient;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
    private tokenService: TokenService,
  ) {
    this.prisma = new PrismaClient();
  }

  // Availability checks
  async isEmailAvailable(email: string): Promise<boolean> {
    if (!email) return false;
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    return !user;
  }

  async isUsernameAvailable(username: string): Promise<boolean> {
    if (!username) return false;
    const profile = await this.prisma.profile.findUnique({
      where: { username },
      select: { id: true },
    });
    return !profile;
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, username, displayName } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { profile: { username } }
        ]
      }
    });

    if (existingUser) {
      throw new ConflictException('User with this email or username already exists');
    }

    // Hash password
    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });

    // Create user with profile
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        isVerified: false, // User starts as unverified
        profile: {
          create: {
            username,
            displayName,
          }
        },
        settings: {
          create: {
            theme: 'light',
            notificationsEnabled: true,
            privacyLevel: 'public',
          }
        }
      },
      include: {
        profile: true,
      }
    });

    // Send email verification
    await this.sendEmailVerification(user.id);

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        username: user.profile?.username || '',
        displayName: user.profile?.displayName || '',
        isVerified: user.isVerified,
      }
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { emailOrUsername, password } = loginDto;

    // Find user by email or username
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: emailOrUsername },
          { profile: { username: emailOrUsername } }
        ]
      },
      include: { profile: true }
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await argon2.verify(user.passwordHash, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        username: user.profile?.username || '',
        displayName: user.profile?.displayName || '',
        isVerified: user.isVerified,
      }
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<AuthResponseDto> {
    const { refreshToken } = refreshTokenDto;

    try {
      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('jwt.secret'),
      });

      // Find user
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: { profile: true }
      });

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new tokens
      const tokens = await this.generateTokens(user.id, user.email);

      return {
        ...tokens,
        user: {
          id: user.id,
          email: user.email,
          username: user.profile?.username || '',
          displayName: user.profile?.displayName || '',
          isVerified: user.isVerified,
        }
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string): Promise<void> {
    // Invalidate refresh token by adding to blacklist
    // For now, we'll just return success
    // In production, you might want to store invalidated tokens in Redis
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<{ message: string }> {
    const { token } = verifyEmailDto;

    const result = await this.tokenService.validateEmailVerificationToken(token);

    if (!result.isValid) {
      throw new BadRequestException(result.error || 'Invalid verification token');
    }

    return { message: 'Email successfully verified' };
  }

  async resendEmailVerification(resendVerificationDto: ResendVerificationDto): Promise<{ message: string }> {
    const { email } = resendVerificationDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isVerified) {
      throw new BadRequestException('Email is already verified');
    }

    await this.sendEmailVerification(user.id);

    return { message: 'Verification email sent successfully' };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    const { email } = forgotPasswordDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return { message: 'If an account with that email exists, a password reset link has been sent' };
    }

    await this.sendPasswordResetEmail(user.id);

    return { message: 'If an account with that email exists, a password reset link has been sent' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const { token, password } = resetPasswordDto;

    const result = await this.tokenService.consumePasswordResetToken(token);

    if (!result.isValid) {
      throw new BadRequestException(result.error || 'Invalid or expired reset token');
    }

    // Hash new password
    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });

    // Update user password
    await this.prisma.user.update({
      where: { id: result.userId },
      data: { passwordHash: hashedPassword },
    });

    return { message: 'Password successfully reset' };
  }

  private async sendEmailVerification(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = await this.tokenService.createEmailVerificationToken(userId);
    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
    const verificationUrl = `${frontendUrl}/verify-email?token=${token}`;

    await this.emailService.sendEmailVerification({
      email: user.email,
      displayName: user.profile?.displayName || user.email,
      verificationUrl,
      expirationHours: 24,
    });
  }

  private async sendPasswordResetEmail(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = await this.tokenService.createPasswordResetToken(userId);
    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

    await this.emailService.sendPasswordReset({
      email: user.email,
      displayName: user.profile?.displayName || user.email,
      resetUrl,
      expirationHours: 1,
    });
  }

  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };
    
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('jwt.secret'),
        expiresIn: this.configService.get('jwt.expiresIn'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('jwt.secret'),
        expiresIn: this.configService.get('jwt.refreshExpiresIn'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: 15 * 60, // 15 minutes in seconds
    };
  }
} 