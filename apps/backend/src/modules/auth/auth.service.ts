import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { PrismaClient } from '@prisma/client';

import { RegisterDto, LoginDto, RefreshTokenDto, AuthResponseDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private prisma: PrismaClient;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.prisma = new PrismaClient();
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

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        username: user.profile?.username || '',
        displayName: user.profile?.displayName || '',
      }
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
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