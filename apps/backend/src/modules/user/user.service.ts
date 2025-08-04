import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

import { UserResponseDto, UpdateUserDto, ChangePasswordDto } from './dto/user.dto';

@Injectable()
export class UserService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findById(userId: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.mapToUserResponse(user);
  }

  async findByEmail(email: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { profile: true }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.mapToUserResponse(user);
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const { displayName, bio, avatarUrl } = updateUserDto;

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        profile: {
          update: {
            displayName,
            bio,
            avatarUrl,
          }
        }
      },
      include: { profile: true }
    });

    return this.mapToUserResponse(user);
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
    const { currentPassword, newPassword } = changePasswordDto;

    // Get user with current password
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await argon2.verify(user.passwordHash, currentPassword);
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const hashedNewPassword = await argon2.hash(newPassword, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });

    // Update password
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hashedNewPassword }
    });

    return { message: 'Password changed successfully' };
  }

  async deleteUser(userId: string): Promise<{ message: string }> {
    await this.prisma.user.delete({
      where: { id: userId }
    });

    return { message: 'User deleted successfully' };
  }

  private mapToUserResponse(user: any): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      username: user.profile?.username || '',
      displayName: user.profile?.displayName || '',
      bio: user.profile?.bio || '',
      avatarUrl: user.profile?.avatarUrl || '',
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
} 