import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { RefreshDto } from './dto/refresh.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

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
      data: { email: dto.email, username: dto.username, passwordHash, name: dto.name },
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

  @Get('availability')
  async availability(
    @Query('email') email?: string,
    @Query('name') name?: string,
    @Query('username') username?: string,
  ) {
    const [emailUser, nameUser, usernameUser] = await Promise.all([
      email ? this.prisma.user.findUnique({ where: { email } }) : Promise.resolve(null),
      name ? this.prisma.user.findFirst({ where: { name } }) : Promise.resolve(null),
      username ? this.prisma.user.findUnique({ where: { username } }) : Promise.resolve(null),
    ]);
    return {
      emailTaken: Boolean(emailUser || false),
      nameTaken: Boolean(nameUser || false),
      usernameTaken: Boolean(usernameUser || false),
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@Body() dto: RefreshDto) {
    // Decode without verifying email/role; verify signature with refresh secret
    const decoded: any = await this.auth['jwt'].verifyAsync(dto.refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'dev_jwt_secret',
      ignoreExpiration: false,
    });
    const tokens = await this.auth.rotateRefreshToken(decoded.sub, dto.refreshToken);
    const user = await this.prisma.user.findUnique({ where: { id: decoded.sub } });
    return {
      user: user && { id: user.id, email: user.email, name: user.name, role: user.role },
      ...tokens,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: any) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('logout')
  async logout(@Req() req: any) {
    const userId = req.user?.userId;
    if (userId) {
      await this.prisma.user.update({ where: { id: userId }, data: { refreshTokenHash: null } });
    }
  }
}
