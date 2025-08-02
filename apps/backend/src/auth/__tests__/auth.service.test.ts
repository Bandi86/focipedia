import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { PrismaService } from '../prisma.service';
import { PasswordService } from '../services/password.service';
import { TokenService } from '../services/token.service';

// Provide a minimal vi shim for ts typechecking when using Jest runner
const vi = {
  fn: jest.fn,
  clearAllMocks: jest.clearAllMocks,
} as const;

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let passwordService: PasswordService;
  let tokenService: TokenService;

  const mockPrismaService = {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    authSession: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
  };

  const mockPasswordService = {
    hash: vi.fn(),
    verify: vi.fn(),
  };

  const mockTokenService = {
    generateSessionId: vi.fn(),
    generateRefreshToken: vi.fn(),
    createCookie: vi.fn(),
    createLogoutCookie: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: PasswordService,
          useValue: mockPasswordService,
        },
        {
          provide: TokenService,
          useValue: mockTokenService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    passwordService = module.get<PasswordService>(PasswordService);
    tokenService = module.get<TokenService>(TokenService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    const registerDto = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    };

    it('should register a new user successfully', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
      };

      const mockSessionId = 'session-123';
      const mockRefreshToken = 'refresh-token-123';
      const mockCookie = {
        name: 'refresh_token',
        value: mockRefreshToken,
        options: { httpOnly: true, secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 },
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPasswordService.hash.mockResolvedValue('hashed-password');
      mockPrismaService.user.create.mockResolvedValue(mockUser);
      mockTokenService.generateSessionId.mockReturnValue(mockSessionId);
      mockTokenService.generateRefreshToken.mockResolvedValue(mockRefreshToken);
      mockPasswordService.hash.mockResolvedValue('hashed-refresh-token');
      mockPrismaService.authSession.create.mockResolvedValue({});
      mockTokenService.createCookie.mockReturnValue(mockCookie);

      const result = await service.register(registerDto);

      expect(result.user).toEqual(mockUser);
      expect(result.cookie).toEqual(mockCookie);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: 'test@example.com',
          passwordHash: 'hashed-password',
          name: 'Test User',
        },
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      const existingUser = { id: 1, email: 'test@example.com' };
      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
      expect(mockPrismaService.user.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should login user successfully', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        passwordHash: 'hashed-password',
      };

      const mockSessionId = 'session-123';
      const mockRefreshToken = 'refresh-token-123';
      const mockCookie = {
        name: 'refresh_token',
        value: mockRefreshToken,
        options: { httpOnly: true, secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 },
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPasswordService.verify.mockResolvedValue(true);
      mockTokenService.generateSessionId.mockReturnValue(mockSessionId);
      mockTokenService.generateRefreshToken.mockResolvedValue(mockRefreshToken);
      mockPasswordService.hash.mockResolvedValue('hashed-refresh-token');
      mockPrismaService.authSession.create.mockResolvedValue({});
      mockTokenService.createCookie.mockReturnValue(mockCookie);

      const result = await service.login(loginDto);

      expect(result.user).toEqual({
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
      });
      expect(result.cookie).toEqual(mockCookie);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        passwordHash: 'hashed-password',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPasswordService.verify.mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('me', () => {
    it('should return user profile', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        emailVerifiedAt: new Date(),
        createdAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.me(1);

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: {
          id: true,
          email: true,
          name: true,
          emailVerifiedAt: true,
          createdAt: true,
        },
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.me(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('logout', () => {
    it('should return logout cookie', () => {
      const mockCookie = {
        name: 'refresh_token',
        value: '',
        options: { httpOnly: true, secure: false, maxAge: 0 },
      };

      mockTokenService.createLogoutCookie.mockReturnValue(mockCookie);

      const result = service.logout();

      expect(result).toEqual(mockCookie);
      expect(mockTokenService.createLogoutCookie).toHaveBeenCalled();
    });
  });
});