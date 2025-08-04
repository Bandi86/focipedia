import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto } from './dto/auth.dto';

// Mock PrismaClient
const mockPrismaClient = {
  user: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

// Mock argon2
jest.mock('argon2', () => ({
  hash: jest.fn(),
  verify: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let configService: ConfigService;
  let prisma: PrismaClient;

  const mockJwtService = {
    signAsync: jest.fn(),
    verify: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
    
    // Mock the PrismaClient instance
    (service as any).prisma = mockPrismaClient;
    prisma = (service as any).prisma;

    // Reset all mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      email: 'test@example.com',
      password: 'password123',
      username: 'testuser',
      displayName: 'Test User',
    };

    const mockUser = {
      id: 'user-id',
      email: 'test@example.com',
      passwordHash: 'hashed-password',
      profile: {
        username: 'testuser',
        displayName: 'Test User',
      },
    };

    const mockTokens = {
      accessToken: 'access-token',
      refreshToken: 'access-token',
      tokenType: 'Bearer',
      expiresIn: 900,
    };

    it('should register a new user successfully', async () => {
      // Arrange
      mockPrismaClient.user.findFirst.mockResolvedValue(null);
      (argon2.hash as jest.Mock).mockResolvedValue('hashed-password');
      mockPrismaClient.user.create.mockResolvedValue(mockUser);
      mockJwtService.signAsync.mockResolvedValue('access-token');
      mockConfigService.get.mockReturnValue('jwt-secret');

      // Act
      const result = await service.register(registerDto);

      // Assert
      expect(mockPrismaClient.user.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [
            { email: registerDto.email },
            { profile: { username: registerDto.username } }
          ]
        }
      });
      expect(argon2.hash).toHaveBeenCalledWith(registerDto.password, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16,
        timeCost: 3,
        parallelism: 1,
      });
      expect(mockPrismaClient.user.create).toHaveBeenCalledWith({
        data: {
          email: registerDto.email,
          passwordHash: 'hashed-password',
          profile: {
            create: {
              username: registerDto.username,
              displayName: registerDto.displayName,
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
      expect(result).toEqual({
        ...mockTokens,
        user: {
          id: mockUser.id,
          email: mockUser.email,
          username: mockUser.profile.username,
          displayName: mockUser.profile.displayName,
        }
      });
    });

    it('should throw ConflictException when user with email already exists', async () => {
      // Arrange
      mockPrismaClient.user.findFirst.mockResolvedValue({
        id: 'existing-user',
        email: registerDto.email,
      });

      // Act & Assert
      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
      await expect(service.register(registerDto)).rejects.toThrow('User with this email or username already exists');
    });

    it('should throw ConflictException when user with username already exists', async () => {
      // Arrange
      mockPrismaClient.user.findFirst.mockResolvedValue({
        id: 'existing-user',
        profile: { username: registerDto.username },
      });

      // Act & Assert
      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
      await expect(service.register(registerDto)).rejects.toThrow('User with this email or username already exists');
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      mockPrismaClient.user.findFirst.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(service.register(registerDto)).rejects.toThrow('Database error');
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockUser = {
      id: 'user-id',
      email: 'test@example.com',
      passwordHash: 'hashed-password',
      profile: {
        username: 'testuser',
        displayName: 'Test User',
      },
    };

    const mockTokens = {
      accessToken: 'access-token',
      refreshToken: 'access-token',
      tokenType: 'Bearer',
      expiresIn: 900,
    };

    it('should login user successfully with valid credentials', async () => {
      // Arrange
      mockPrismaClient.user.findUnique.mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('access-token');
      mockConfigService.get.mockReturnValue('jwt-secret');

      // Act
      const result = await service.login(loginDto);

      // Assert
      expect(mockPrismaClient.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginDto.email },
        include: { profile: true }
      });
      expect(argon2.verify).toHaveBeenCalledWith(mockUser.passwordHash, loginDto.password);
      expect(result).toEqual({
        ...mockTokens,
        user: {
          id: mockUser.id,
          email: mockUser.email,
          username: mockUser.profile.username,
          displayName: mockUser.profile.displayName,
        }
      });
    });

    it('should throw UnauthorizedException when user does not exist', async () => {
      // Arrange
      mockPrismaClient.user.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      await expect(service.login(loginDto)).rejects.toThrow('Invalid credentials');
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      // Arrange
      mockPrismaClient.user.findUnique.mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(false);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      await expect(service.login(loginDto)).rejects.toThrow('Invalid credentials');
    });

    it('should handle user without profile gracefully', async () => {
      // Arrange
      const userWithoutProfile = { ...mockUser, profile: null };
      mockPrismaClient.user.findUnique.mockResolvedValue(userWithoutProfile);
      (argon2.verify as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('access-token');
      mockConfigService.get.mockReturnValue('jwt-secret');

      // Act
      const result = await service.login(loginDto);

      // Assert
      expect(result.user.username).toBe('');
      expect(result.user.displayName).toBe('');
    });
  });

  describe('refreshToken', () => {
    const refreshTokenDto: RefreshTokenDto = {
      refreshToken: 'valid-refresh-token',
    };

    const mockUser = {
      id: 'user-id',
      email: 'test@example.com',
      profile: {
        username: 'testuser',
        displayName: 'Test User',
      },
    };

    const mockPayload = {
      sub: 'user-id',
      email: 'test@example.com',
    };

    it('should refresh token successfully with valid refresh token', async () => {
      // Arrange
      mockJwtService.verify.mockReturnValue(mockPayload);
      mockConfigService.get.mockReturnValue('jwt-secret');
      mockPrismaClient.user.findUnique.mockResolvedValue(mockUser);
      mockJwtService.signAsync.mockResolvedValue('new-access-token');

      // Act
      const result = await service.refreshToken(refreshTokenDto);

      // Assert
      expect(mockJwtService.verify).toHaveBeenCalledWith(refreshTokenDto.refreshToken, {
        secret: 'jwt-secret',
      });
      expect(mockPrismaClient.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockPayload.sub },
        include: { profile: true }
      });
      expect(result).toBeDefined();
    });

    it('should throw UnauthorizedException when refresh token is invalid', async () => {
      // Arrange
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // Act & Assert
      await expect(service.refreshToken(refreshTokenDto)).rejects.toThrow(UnauthorizedException);
      await expect(service.refreshToken(refreshTokenDto)).rejects.toThrow('Invalid refresh token');
    });

    it('should throw UnauthorizedException when user does not exist', async () => {
      // Arrange
      mockJwtService.verify.mockReturnValue(mockPayload);
      mockConfigService.get.mockReturnValue('jwt-secret');
      mockPrismaClient.user.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.refreshToken(refreshTokenDto)).rejects.toThrow(UnauthorizedException);
      await expect(service.refreshToken(refreshTokenDto)).rejects.toThrow('Invalid refresh token');
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      // Arrange
      const userId = 'user-id';

      // Act
      const result = await service.logout(userId);

      // Assert
      expect(result).toBeUndefined();
      // In a real implementation, you would verify that the token was invalidated
    });
  });

  describe('generateTokens', () => {
    it('should generate access and refresh tokens', async () => {
      // Arrange
      const userId = 'user-id';
      const email = 'test@example.com';
      mockJwtService.signAsync.mockResolvedValue('access-token');
      mockConfigService.get.mockReturnValue('jwt-secret');

      // Act
      const result = await (service as any).generateTokens(userId, email);

      // Assert
      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'access-token',
        tokenType: 'Bearer',
        expiresIn: 900,
      });
    });
  });
}); 