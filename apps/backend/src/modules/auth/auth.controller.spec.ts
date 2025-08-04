import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto, AuthResponseDto } from './dto/auth.dto';

// Mock argon2 to avoid native module issues in tests
jest.mock('argon2', () => ({
  hash: jest.fn(),
  verify: jest.fn(),
}));

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    refreshToken: jest.fn(),
    logout: jest.fn(),
  };

  const mockAuthResponse: AuthResponseDto = {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    tokenType: 'Bearer',
    expiresIn: 900,
    user: {
      id: 'user-id',
      email: 'test@example.com',
      username: 'testuser',
      displayName: 'Test User',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  describe('register', () => {
    const validRegisterDto: RegisterDto = {
      email: 'test@example.com',
      password: 'password123',
      username: 'testuser',
      displayName: 'Test User',
    };

    it('should register a new user successfully', async () => {
      // Arrange
      mockAuthService.register.mockResolvedValue(mockAuthResponse);

      // Act
      const result = await controller.register(validRegisterDto);

      // Assert
      expect(result).toEqual(mockAuthResponse);
      expect(mockAuthService.register).toHaveBeenCalledWith(validRegisterDto);
    });

    it('should handle registration errors', async () => {
      // Arrange
      const error = new Error('User with this email already exists');
      mockAuthService.register.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.register(validRegisterDto)).rejects.toThrow('User with this email already exists');
      expect(mockAuthService.register).toHaveBeenCalledWith(validRegisterDto);
    });
  });

  describe('login', () => {
    const validLoginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should login user successfully', async () => {
      // Arrange
      mockAuthService.login.mockResolvedValue(mockAuthResponse);

      // Act
      const result = await controller.login(validLoginDto);

      // Assert
      expect(result).toEqual(mockAuthResponse);
      expect(mockAuthService.login).toHaveBeenCalledWith(validLoginDto);
    });

    it('should handle login errors', async () => {
      // Arrange
      const error = new Error('Invalid credentials');
      mockAuthService.login.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.login(validLoginDto)).rejects.toThrow('Invalid credentials');
      expect(mockAuthService.login).toHaveBeenCalledWith(validLoginDto);
    });
  });

  describe('refreshToken', () => {
    const validRefreshDto: RefreshTokenDto = {
      refreshToken: 'valid-refresh-token',
    };

    it('should refresh token successfully', async () => {
      // Arrange
      mockAuthService.refreshToken.mockResolvedValue(mockAuthResponse);

      // Act
      const result = await controller.refreshToken(validRefreshDto);

      // Assert
      expect(result).toEqual(mockAuthResponse);
      expect(mockAuthService.refreshToken).toHaveBeenCalledWith(validRefreshDto);
    });

    it('should handle refresh token errors', async () => {
      // Arrange
      const error = new Error('Invalid refresh token');
      mockAuthService.refreshToken.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.refreshToken(validRefreshDto)).rejects.toThrow('Invalid refresh token');
      expect(mockAuthService.refreshToken).toHaveBeenCalledWith(validRefreshDto);
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      // Arrange
      const mockRequest = { user: { id: 'user-id' } };
      mockAuthService.logout.mockResolvedValue(undefined);

      // Act
      const result = await controller.logout(mockRequest as any);

      // Assert
      expect(result).toEqual({ message: 'Logged out successfully' });
      expect(mockAuthService.logout).toHaveBeenCalledWith('user-id');
    });

    it('should handle logout errors', async () => {
      // Arrange
      const mockRequest = { user: { id: 'user-id' } };
      const error = new Error('Logout failed');
      mockAuthService.logout.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.logout(mockRequest as any)).rejects.toThrow('Logout failed');
      expect(mockAuthService.logout).toHaveBeenCalledWith('user-id');
    });
  });

  describe('forgotPassword', () => {
    it('should handle forgot password request', async () => {
      // Act
      const result = await controller.forgotPassword({ email: 'test@example.com' });

      // Assert
      expect(result).toEqual({ message: 'Password reset email sent (if user exists)' });
    });
  });

  describe('resetPassword', () => {
    it('should handle password reset', async () => {
      // Act
      const result = await controller.resetPassword({ token: 'reset-token', password: 'newpassword' });

      // Assert
      expect(result).toEqual({ message: 'Password reset successfully' });
    });
  });
}); 