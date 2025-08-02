import { Controller, Post, Get, Body, Res, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAccessGuard } from './guards/jwt-access.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { TokenPayload } from './services/token.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.register(dto);
    res.cookie(result.cookie.name, result.cookie.value, result.cookie.options);
    return result.user;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(dto);
    res.cookie(result.cookie.name, result.cookie.value, result.cookie.options);
    return result.user;
  }

  @Get('me')
  @UseGuards(JwtAccessGuard)
  async me(@CurrentUser() user: TokenPayload) {
    // user injected from guard token payload; fetch full profile via service for accuracy
    return this.authService.me(user.sub);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    const cookie = this.authService.logout();
    res.cookie(cookie.name, cookie.value, cookie.options);
    return { ok: true };
  }
} 