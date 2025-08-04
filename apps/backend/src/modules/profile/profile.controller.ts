import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { ProfileService } from './profile.service';
import { ProfileResponseDto, UpdateProfileDto, PublicProfileResponseDto } from './dto/profile.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/auth.decorator';
import { Public } from '../../common/decorators/auth.decorator';

@ApiTags('profiles')
@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: ProfileResponseDto,
  })
  async getCurrentUserProfile(@CurrentUser() user: any): Promise<ProfileResponseDto> {
    return this.profileService.findByUserId(user.id);
  }

  @Put('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully',
    type: ProfileResponseDto,
  })
  async updateCurrentUserProfile(
    @CurrentUser() user: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileResponseDto> {
    return this.profileService.updateProfile(user.id, updateProfileDto);
  }

  @Get(':username')
  @Public()
  @ApiOperation({ summary: 'Get public profile by username' })
  @ApiResponse({
    status: 200,
    description: 'Public profile retrieved successfully',
    type: PublicProfileResponseDto,
  })
  async getPublicProfile(@Param('username') username: string): Promise<PublicProfileResponseDto> {
    return this.profileService.findByUsername(username);
  }
} 