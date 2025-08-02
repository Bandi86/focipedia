import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from './prisma.service';
import { PasswordService } from './services/password.service';
import { TokenService } from './services/token.service';
import { JwtAccessGuard } from './guards/jwt-access.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key-here',
      signOptions: {
        issuer: 'focipedia',
        audience: 'focipedia-users',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    PasswordService,
    TokenService,
    JwtAccessGuard,
  ],
  exports: [AuthService, PrismaService, JwtAccessGuard],
})
export class AuthModule {} 