import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

import { UserService } from './user.service';
import { UpdateUserDto, ChangePasswordDto } from './dto/user.dto';

// Mock PrismaClient
const mockPrismaClient = {
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

// Mock argon2
jest.mock('argon2', () => ({
  hash: jest.fn(),
  verify: jest.fn(),
}));

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaClient;

  const mockUser = {
    id: 'user-id',
    email: 'test@example.com',
    passwordHash: 'hashed-password',
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    profile: {
      username: 'testuser',
      displayName: 'Test User',
      bio: 'Test bio',
      avatarUrl: 'https://example.com/avatar.jpg',
    },
  };

  const mockUserResponse = {
    id: 'user-id',
    email: 'test@example.com',
    username: 'testuser',
    displayName: 'Test User',
    bio: 'Test bio',
    avatarUrl: 'https://example.com/avatar.jpg',
    isVerified: true,
    createdAt: mockUser.createdAt,
    updatedAt: mockUser.updatedAt,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
    
    // Mock the PrismaClient instance
    (service as any).prisma = mockPrismaClient;
    prisma = (service as any).prisma;

    // Reset all mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should find user by ID successfully', async () => {
      // Arrange
      const userId = 'user-id';
      mockPrismaClient.user.findUnique.mockResolvedValue(mockUser);

      // Act
      const result = await service.findById(userId);

      // Assert
      expect(mockPrismaClient.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        include: { profile: true }
      });
      expect(result).toEqual(mockUserResponse);
    });

    it('should throw NotFoundException when user not found', async () => {
      // Arrange
      const userId = 'non-existent-id';
      mockPrismaClient.user.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findById(userId)).rejects.toThrow(NotFoundException);
      await expect(service.findById(userId)).rejects.toThrow('User not found');
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      const userId = 'user-id';
      mockPrismaClient.user.findUnique.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(service.findById(userId)).rejects.toThrow('Database error');
    });
  });

  describe('findByEmail', () => {
    it('should find user by email successfully', async () => {
      // Arrange
      const email = 'test@example.com';
      mockPrismaClient.user.findUnique.mockResolvedValue(mockUser);

      // Act
      const result = await service.findByEmail(email);

      // Assert
      expect(mockPrismaClient.user.findUnique).toHaveBeenCalledWith({
        where: { email },
        include: { profile: true }
      });
      expect(result).toEqual(mockUserResponse);
    });

    it('should throw NotFoundException when user not found', async () => {
      // Arrange
      const email = 'nonexistent@example.com';
      mockPrismaClient.user.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findByEmail(email)).rejects.toThrow(NotFoundException);
      await expect(service.findByEmail(email)).rejects.toThrow('User not found');
    });
  });

  describe('updateUser', () => {
    const updateUserDto: UpdateUserDto = {
      displayName: 'Updated User',
      bio: 'Updated bio',
      avatarUrl: 'https://example.com/new-avatar.jpg',
    };

    const updatedUser = {
      ...mockUser,
      profile: {
        ...mockUser.profile,
        displayName: updateUserDto.displayName,
        bio: updateUserDto.bio,
        avatarUrl: updateUserDto.avatarUrl,
      },
    };

    const updatedUserResponse = {
      ...mockUserResponse,
      displayName: updateUserDto.displayName,
      bio: updateUserDto.bio,
      avatarUrl: updateUserDto.avatarUrl,
    };

    it('should update user successfully', async () => {
      // Arrange
      const userId = 'user-id';
      mockPrismaClient.user.update.mockResolvedValue(updatedUser);

      // Act
      const result = await service.updateUser(userId, updateUserDto);

      // Assert
      expect(mockPrismaClient.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: {
          profile: {
            update: {
              displayName: updateUserDto.displayName,
              bio: updateUserDto.bio,
              avatarUrl: updateUserDto.avatarUrl,
            }
          }
        },
        include: { profile: true }
      });
      expect(result).toEqual(updatedUserResponse);
    });

    it('should handle partial updates', async () => {
      // Arrange
      const userId = 'user-id';
      const partialUpdateDto = { displayName: 'Partial Update' };
      const partiallyUpdatedUser = {
        ...mockUser,
        profile: {
          ...mockUser.profile,
          displayName: partialUpdateDto.displayName,
        },
      };
      mockPrismaClient.user.update.mockResolvedValue(partiallyUpdatedUser);

      // Act
      const result = await service.updateUser(userId, partialUpdateDto);

      // Assert
      expect(result.displayName).toBe(partialUpdateDto.displayName);
      expect(result.bio).toBe(mockUser.profile.bio); // Should remain unchanged
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      const userId = 'user-id';
      mockPrismaClient.user.update.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(service.updateUser(userId, updateUserDto)).rejects.toThrow('Database error');
    });
  });

  describe('changePassword', () => {
    const changePasswordDto: ChangePasswordDto = {
      currentPassword: 'current-password',
      newPassword: 'new-password',
    };

    it('should change password successfully', async () => {
      // Arrange
      const userId = 'user-id';
      mockPrismaClient.user.findUnique.mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(true);
      (argon2.hash as jest.Mock).mockResolvedValue('new-hashed-password');
      mockPrismaClient.user.update.mockResolvedValue({ ...mockUser, passwordHash: 'new-hashed-password' });

      // Act
      const result = await service.changePassword(userId, changePasswordDto);

      // Assert
      expect(mockPrismaClient.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId }
      });
      expect(argon2.verify).toHaveBeenCalledWith(mockUser.passwordHash, changePasswordDto.currentPassword);
      expect(argon2.hash).toHaveBeenCalledWith(changePasswordDto.newPassword, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16,
        timeCost: 3,
        parallelism: 1,
      });
      expect(mockPrismaClient.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { passwordHash: 'new-hashed-password' }
      });
      expect(result).toEqual({ message: 'Password changed successfully' });
    });

    it('should throw NotFoundException when user not found', async () => {
      // Arrange
      const userId = 'non-existent-id';
      mockPrismaClient.user.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.changePassword(userId, changePasswordDto)).rejects.toThrow(NotFoundException);
      await expect(service.changePassword(userId, changePasswordDto)).rejects.toThrow('User not found');
    });

    it('should throw UnauthorizedException when current password is incorrect', async () => {
      // Arrange
      const userId = 'user-id';
      mockPrismaClient.user.findUnique.mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(false);

      // Act & Assert
      await expect(service.changePassword(userId, changePasswordDto)).rejects.toThrow(UnauthorizedException);
      await expect(service.changePassword(userId, changePasswordDto)).rejects.toThrow('Current password is incorrect');
    });

    it('should handle password hashing errors gracefully', async () => {
      // Arrange
      const userId = 'user-id';
      mockPrismaClient.user.findUnique.mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(true);
      (argon2.hash as jest.Mock).mockRejectedValue(new Error('Hashing error'));

      // Act & Assert
      await expect(service.changePassword(userId, changePasswordDto)).rejects.toThrow('Hashing error');
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      // Arrange
      const userId = 'user-id';
      mockPrismaClient.user.delete.mockResolvedValue(mockUser);

      // Act
      const result = await service.deleteUser(userId);

      // Assert
      expect(mockPrismaClient.user.delete).toHaveBeenCalledWith({
        where: { id: userId }
      });
      expect(result).toEqual({ message: 'User deleted successfully' });
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      const userId = 'user-id';
      mockPrismaClient.user.delete.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(service.deleteUser(userId)).rejects.toThrow('Database error');
    });
  });

  describe('mapToUserResponse', () => {
    it('should map user to response DTO correctly', () => {
      // Act
      const result = (service as any).mapToUserResponse(mockUser);

      // Assert
      expect(result).toEqual(mockUserResponse);
    });

    it('should handle user without profile gracefully', () => {
      // Arrange
      const userWithoutProfile = { ...mockUser, profile: null };

      // Act
      const result = (service as any).mapToUserResponse(userWithoutProfile);

      // Assert
      expect(result.username).toBe('');
      expect(result.displayName).toBe('');
      expect(result.bio).toBe('');
      expect(result.avatarUrl).toBe('');
    });
  });
}); 