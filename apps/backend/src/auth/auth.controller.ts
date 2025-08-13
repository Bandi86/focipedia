import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private auth: AuthService,
    private prisma: PrismaService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const passwordHash = await this.auth.hashPassword(dto.password);
    const user = await this.prisma.user.create({
      data: { email: dto.email, passwordHash, name: dto.name },
    });
    const tokens = await this.auth.issueTokens(user.id, user.email, user.role);
    return {
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      ...tokens,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.auth.validateUser(dto.email, dto.password);
    const tokens = await this.auth.issueTokens(user.id, user.email, user.role);
    return {
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      ...tokens,
    };
  }
}
