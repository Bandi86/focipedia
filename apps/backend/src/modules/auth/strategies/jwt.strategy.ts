import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // Lazily require PrismaClient after super() to satisfy TS rules on `this` usage
  private prisma!: any;

  constructor(private readonly configService: ConfigService) {
    const secret = configService.get<string>('jwt.secret');
    if (!secret) {
      throw new Error('Missing JWT secret (config key: jwt.secret)');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
    // Require here to avoid type issues with certain Prisma versions' ESM/CJS exports
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const prismaModule = require('@prisma/client');
    this.prisma = new prismaModule.PrismaClient();
  }

  async validate(payload: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: { profile: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      profile: user.profile,
    };
  }
}