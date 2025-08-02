import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';

export interface TokenPayload {
  sub: number; // user id
  jti: string; // session id
  email: string;
}

export interface CookieOptions {
  name: string;
  value: string;
  options: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'strict' | 'lax' | 'none';
    maxAge: number;
    path: string;
  };
}

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  generateSessionId(): string {
    return randomUUID();
  }

  async generateAccessToken(payload: Omit<TokenPayload, 'jti'> & { jti: string }): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      issuer: 'focipedia',
      audience: 'focipedia-users',
    });
  }

  async generateRefreshToken(payload: Omit<TokenPayload, 'jti'> & { jti: string }): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: '7d',
      issuer: 'focipedia',
      audience: 'focipedia-users',
    });
  }

  async verifyToken(token: string): Promise<TokenPayload> {
    return this.jwtService.verifyAsync<TokenPayload>(token, {
      issuer: 'focipedia',
      audience: 'focipedia-users',
    });
  }

  createCookie(name: string, value: string, maxAge: number): CookieOptions {
    return {
      name,
      value,
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge,
        path: '/',
      },
    };
  }

  createLogoutCookie(): CookieOptions {
    return {
      name: 'refresh_token',
      value: '',
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 0,
        path: '/',
      },
    };
  }
} 