import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { SettingsResponseDto, UpdateSettingsDto } from './dto/settings.dto';

@Injectable()
export class SettingsService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findByUserId(userId: string): Promise<SettingsResponseDto> {
    const settings = await this.prisma.settings.findUnique({
      where: { userId }
    });

    if (!settings) {
      throw new NotFoundException('Settings not found');
    }

    return this.mapToSettingsResponse(settings);
  }

  async updateSettings(userId: string, updateSettingsDto: UpdateSettingsDto): Promise<SettingsResponseDto> {
    const { theme, notificationsEnabled, privacyLevel } = updateSettingsDto;

    const settings = await this.prisma.settings.update({
      where: { userId },
      data: {
        theme,
        notificationsEnabled,
        privacyLevel,
      }
    });

    return this.mapToSettingsResponse(settings);
  }

  async resetSettings(userId: string): Promise<SettingsResponseDto> {
    const settings = await this.prisma.settings.update({
      where: { userId },
      data: {
        theme: 'light',
        notificationsEnabled: true,
        privacyLevel: 'public',
      }
    });

    return this.mapToSettingsResponse(settings);
  }

  private mapToSettingsResponse(settings: any): SettingsResponseDto {
    return {
      id: settings.id,
      userId: settings.userId,
      theme: settings.theme,
      notificationsEnabled: settings.notificationsEnabled,
      privacyLevel: settings.privacyLevel,
      createdAt: settings.createdAt,
      updatedAt: settings.updatedAt,
    };
  }
} 