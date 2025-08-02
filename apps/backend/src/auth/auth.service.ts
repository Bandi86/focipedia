import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PasswordService } from './services/password.service';
import { TokenService, CookieOptions } from './services/token.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

export interface AuthResult {
  user: {
    id: number;
    email: string;
    name?: string | null;
  };
  cookie: CookieOptions;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService,
    private tokenService: TokenService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResult> {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const passwordHash = await this.passwordService.hash(dto.password);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        name: dto.name,
      },
    });

    // Create session
    const sessionId = this.tokenService.generateSessionId();
    const refreshToken = await this.tokenService.generateRefreshToken({
      sub: user.id,
      jti: sessionId,
      email: user.email,
    });

    // Store session in database
    await this.prisma.authSession.create({
      data: {
        id: sessionId,
        userId: user.id,
        tokenHash: await this.passwordService.hash(refreshToken),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    const cookie = this.tokenService.createCookie(
      'refresh_token',
      refreshToken,
      7 * 24 * 60 * 60 * 1000, // 7 days
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      cookie,
    };
  }

  async login(dto: LoginDto): Promise<AuthResult> {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await this.passwordService.verify(user.passwordHash, dto.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Create session
    const sessionId = this.tokenService.generateSessionId();
    const refreshToken = await this.tokenService.generateRefreshToken({
      sub: user.id,
      jti: sessionId,
      email: user.email,
    });

    // Store session in database
    await this.prisma.authSession.create({
      data: {
        id: sessionId,
        userId: user.id,
        tokenHash: await this.passwordService.hash(refreshToken),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    const cookie = this.tokenService.createCookie(
      'refresh_token',
      refreshToken,
      7 * 24 * 60 * 60 * 1000, // 7 days
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      cookie,
    };
  }

  async me(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerifiedAt: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  logout(): CookieOptions {
    return this.tokenService.createLogoutCookie();
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = await this.tokenService.verifyToken(refreshToken);
      
      // Check if session exists and is valid
      const session = await this.prisma.authSession.findUnique({
        where: { id: payload.jti },
        include: { user: true },
      });

      if (!session || session.revokedAt || session.expiresAt < new Date()) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new access token
      const accessToken = await this.tokenService.generateAccessToken({
        sub: payload.sub,
        jti: payload.jti,
        email: payload.email,
      });

      return { accessToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
} 