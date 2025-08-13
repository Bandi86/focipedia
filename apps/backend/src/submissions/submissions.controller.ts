import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards, Req } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiTags } from '@nestjs/swagger';
import { SubmissionTargetType } from '@prisma/client';

class CreateSubmissionDto {
  targetType!: SubmissionTargetType;
  operation!: 'CREATE' | 'UPDATE' | 'DELETE';
  targetId?: number;
  changes!: any;
}

class DecisionDto {
  comment?: string;
}

@ApiTags('submissions')
@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req: any, @Body() dto: CreateSubmissionDto) {
    return this.submissionsService.createSubmission({
      userId: req.user.userId,
      targetType: dto.targetType,
      operation: dto.operation,
      targetId: dto.targetId,
      changes: dto.changes,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('pending')
  async listPending() {
    return this.submissionsService.listPending();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.submissionsService.getById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/approve')
  async approve(@Req() req: any, @Param('id', ParseIntPipe) id: number, @Body() dto: DecisionDto) {
    return this.submissionsService.approve({ submissionId: id, reviewerId: req.user.userId, comment: dto.comment });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/reject')
  async reject(@Req() req: any, @Param('id', ParseIntPipe) id: number, @Body() dto: DecisionDto) {
    return this.submissionsService.reject({ submissionId: id, reviewerId: req.user.userId, comment: dto.comment });
  }
}


