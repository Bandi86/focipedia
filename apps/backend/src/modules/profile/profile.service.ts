import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { ProfileResponseDto, UpdateProfileDto, PublicProfileResponseDto } from './dto/profile.dto';

@Injectable()
export class ProfileService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findByUserId(userId: string): Promise<ProfileResponseDto> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId }
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return this.mapToProfileResponse(profile);
  }

  async findByUsername(username: string): Promise<PublicProfileResponseDto> {
    const profile = await this.prisma.profile.findUnique({
      where: { username }
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return this.mapToPublicProfileResponse(profile);
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<ProfileResponseDto> {
    const { displayName, bio, avatarUrl } = updateProfileDto;

    const profile = await this.prisma.profile.update({
      where: { userId },
      data: {
        displayName,
        bio,
        avatarUrl,
      }
    });

    return this.mapToProfileResponse(profile);
  }

  private mapToProfileResponse(profile: any): ProfileResponseDto {
    return {
      id: profile.id,
      userId: profile.userId,
      username: profile.username,
      displayName: profile.displayName,
      bio: profile.bio,
      avatarUrl: profile.avatarUrl,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }

  private mapToPublicProfileResponse(profile: any): PublicProfileResponseDto {
    return {
      username: profile.username,
      displayName: profile.displayName,
      bio: profile.bio,
      avatarUrl: profile.avatarUrl,
      createdAt: profile.createdAt,
    };
  }
} 