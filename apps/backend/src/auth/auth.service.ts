import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

interface JwtPayload {
  sub: number;
  email: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async hashPassword(plain: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(plain, salt);
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  private async signAccessToken(userId: number, email: string, role: string) {
    const payload: JwtPayload = { sub: userId, email, role };
    return this.jwt.signAsync(payload, {
      secret: process.env.JWT_SECRET || 'dev_jwt_secret',
      expiresIn: '15m',
    });
  }

  private async signRefreshToken(userId: number) {
    const payload = { sub: userId, type: 'refresh' } as const;
    return this.jwt.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'dev_jwt_secret',
      expiresIn: '7d',
    });
  }

  async issueTokens(userId: number, email: string, role: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(userId, email, role),
      this.signRefreshToken(userId),
    ]);
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({ where: { id: userId }, data: { refreshTokenHash } });
    return { accessToken, refreshToken };
  }

  async rotateRefreshToken(userId: number, providedToken: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.refreshTokenHash) throw new UnauthorizedException('No refresh token');
    const ok = await bcrypt.compare(providedToken, user.refreshTokenHash);
    if (!ok) throw new UnauthorizedException('Invalid refresh token');
    // issue new pair and store new hash (rotate)
    return this.issueTokens(user.id, user.email, user.role);
  }
}
