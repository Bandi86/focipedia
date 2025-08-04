import {
  Controller,
  Get,
  Put,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { SettingsService } from './settings.service';
import { SettingsResponseDto, UpdateSettingsDto } from './dto/settings.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/auth.decorator';

@ApiTags('settings')
@Controller('settings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user settings' })
  @ApiResponse({
    status: 200,
    description: 'User settings retrieved successfully',
    type: SettingsResponseDto,
  })
  async getCurrentUserSettings(@CurrentUser() user: any): Promise<SettingsResponseDto> {
    return this.settingsService.findByUserId(user.id);
  }

  @Put('me')
  @ApiOperation({ summary: 'Update current user settings' })
  @ApiResponse({
    status: 200,
    description: 'User settings updated successfully',
    type: SettingsResponseDto,
  })
  async updateCurrentUserSettings(
    @CurrentUser() user: any,
    updateSettingsDto: UpdateSettingsDto,
  ): Promise<SettingsResponseDto> {
    return this.settingsService.updateSettings(user.id, updateSettingsDto);
  }

  @Post('me/reset')
  @ApiOperation({ summary: 'Reset current user settings to defaults' })
  @ApiResponse({
    status: 200,
    description: 'User settings reset successfully',
    type: SettingsResponseDto,
  })
  async resetCurrentUserSettings(@CurrentUser() user: any): Promise<SettingsResponseDto> {
    return this.settingsService.resetSettings(user.id);
  }
} 