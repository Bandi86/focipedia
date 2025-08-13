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

  async issueTokens(userId: number, email: string, role: string) {
    const payload: JwtPayload = { sub: userId, email, role };
    const accessToken = await this.jwt.signAsync(payload);
    return { accessToken };
  }
}
