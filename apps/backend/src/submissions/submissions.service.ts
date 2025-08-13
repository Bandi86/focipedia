import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Submission } from '@prisma/client';
import { ModerationStatus, SubmissionTargetType } from '@prisma/client';

@Injectable()
export class SubmissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async createSubmission(params: {
    userId: number;
    targetType: SubmissionTargetType;
    operation: 'CREATE' | 'UPDATE' | 'DELETE';
    targetId?: number;
    changes: any;
  }): Promise<Submission> {
    const { userId, targetType, operation, targetId, changes } = params;
    const jsonChanges: Prisma.InputJsonValue | Prisma.JsonNullValueInput =
      changes === null ? Prisma.JsonNull : (changes as Prisma.InputJsonValue);
    return this.prisma.submission.create({
      data: {
        createdById: userId,
        targetType,
        operation,
        targetId: targetId ?? null,
        changes: jsonChanges,
      },
    });
  }

  async listPending(): Promise<Submission[]> {
    return this.prisma.submission.findMany({
      where: { status: ModerationStatus.PENDING },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getById(id: number): Promise<Submission> {
    const sub = await this.prisma.submission.findUnique({ where: { id } });
    if (!sub) throw new NotFoundException('Submission not found');
    return sub;
  }

  async approve(params: { submissionId: number; reviewerId: number; comment?: string }): Promise<Submission> {
    const { submissionId, reviewerId, comment } = params;
    const sub = await this.getById(submissionId);
    if (sub.status !== ModerationStatus.PENDING) {
      throw new ForbiddenException('Submission already decided');
    }

    // Apply changes per target type
    const changes = sub.changes as any;
    switch (sub.targetType) {
      case SubmissionTargetType.TEAM: {
        if (sub.operation === 'CREATE') await this.prisma.team.create({ data: changes });
        else if (sub.operation === 'UPDATE') {
          if (!sub.targetId) throw new ForbiddenException('Missing targetId for update');
          await this.prisma.team.update({ where: { id: sub.targetId }, data: changes });
        } else if (sub.operation === 'DELETE') {
          if (!sub.targetId) throw new ForbiddenException('Missing targetId for delete');
          await this.prisma.team.delete({ where: { id: sub.targetId } });
        }
        break;
      }
      case SubmissionTargetType.PLAYER: {
        if (sub.operation === 'CREATE') await this.prisma.player.create({ data: changes });
        else if (sub.operation === 'UPDATE') {
          if (!sub.targetId) throw new ForbiddenException('Missing targetId for update');
          await this.prisma.player.update({ where: { id: sub.targetId }, data: changes });
        } else if (sub.operation === 'DELETE') {
          if (!sub.targetId) throw new ForbiddenException('Missing targetId for delete');
          await this.prisma.player.delete({ where: { id: sub.targetId } });
        }
        break;
      }
      case SubmissionTargetType.LEAGUE: {
        if (sub.operation === 'CREATE') await this.prisma.league.create({ data: changes });
        else if (sub.operation === 'UPDATE') {
          if (!sub.targetId) throw new ForbiddenException('Missing targetId for update');
          await this.prisma.league.update({ where: { id: sub.targetId }, data: changes });
        } else if (sub.operation === 'DELETE') {
          if (!sub.targetId) throw new ForbiddenException('Missing targetId for delete');
          await this.prisma.league.delete({ where: { id: sub.targetId } });
        }
        break;
      }
      case SubmissionTargetType.MATCH: {
        if (sub.operation === 'CREATE') await this.prisma.match.create({ data: changes });
        else if (sub.operation === 'UPDATE') {
          if (!sub.targetId) throw new ForbiddenException('Missing targetId for update');
          await this.prisma.match.update({ where: { id: sub.targetId }, data: changes });
        } else if (sub.operation === 'DELETE') {
          if (!sub.targetId) throw new ForbiddenException('Missing targetId for delete');
          await this.prisma.match.delete({ where: { id: sub.targetId } });
        }
        break;
      }
      case SubmissionTargetType.MATCH_EVENT: {
        if (sub.operation === 'CREATE') await this.prisma.matchEvent.create({ data: changes });
        else if (sub.operation === 'UPDATE') {
          if (!sub.targetId) throw new ForbiddenException('Missing targetId for update');
          await this.prisma.matchEvent.update({ where: { id: sub.targetId }, data: changes });
        } else if (sub.operation === 'DELETE') {
          if (!sub.targetId) throw new ForbiddenException('Missing targetId for delete');
          await this.prisma.matchEvent.delete({ where: { id: sub.targetId } });
        }
        break;
      }
      case SubmissionTargetType.PLAYER_MATCH_STATS: {
        if (sub.operation === 'CREATE') await this.prisma.playerMatchStats.create({ data: changes });
        else if (sub.operation === 'UPDATE') {
          if (!sub.targetId) throw new ForbiddenException('Missing targetId for update');
          await this.prisma.playerMatchStats.update({ where: { id: sub.targetId }, data: changes });
        } else if (sub.operation === 'DELETE') {
          if (!sub.targetId) throw new ForbiddenException('Missing targetId for delete');
          await this.prisma.playerMatchStats.delete({ where: { id: sub.targetId } });
        }
        break;
      }
      case SubmissionTargetType.PLAYER_SEASON_STATS: {
        if (sub.operation === 'CREATE') await this.prisma.playerSeasonStats.create({ data: changes });
        else if (sub.operation === 'UPDATE') {
          if (!sub.targetId) throw new ForbiddenException('Missing targetId for update');
          await this.prisma.playerSeasonStats.update({ where: { id: sub.targetId }, data: changes });
        } else if (sub.operation === 'DELETE') {
          if (!sub.targetId) throw new ForbiddenException('Missing targetId for delete');
          await this.prisma.playerSeasonStats.delete({ where: { id: sub.targetId } });
        }
        break;
      }
      case SubmissionTargetType.TRANSFER: {
        if (sub.operation === 'CREATE') await this.prisma.transfer.create({ data: changes });
        else if (sub.operation === 'UPDATE') {
          if (!sub.targetId) throw new ForbiddenException('Missing targetId for update');
          await this.prisma.transfer.update({ where: { id: sub.targetId }, data: changes });
        } else if (sub.operation === 'DELETE') {
          if (!sub.targetId) throw new ForbiddenException('Missing targetId for delete');
          await this.prisma.transfer.delete({ where: { id: sub.targetId } });
        }
        break;
      }
      case SubmissionTargetType.TROPHY: {
        if (sub.operation === 'CREATE') await this.prisma.trophy.create({ data: changes });
        else if (sub.operation === 'UPDATE') {
          if (!sub.targetId) throw new ForbiddenException('Missing targetId for update');
          await this.prisma.trophy.update({ where: { id: sub.targetId }, data: changes });
        } else if (sub.operation === 'DELETE') {
          if (!sub.targetId) throw new ForbiddenException('Missing targetId for delete');
          await this.prisma.trophy.delete({ where: { id: sub.targetId } });
        }
        break;
      }
      case SubmissionTargetType.PLAYER_TROPHY: {
        if (sub.operation === 'CREATE') await this.prisma.playerTrophy.create({ data: changes });
        else if (sub.operation === 'UPDATE') {
          if (!sub.targetId) throw new ForbiddenException('Missing targetId for update');
          await this.prisma.playerTrophy.update({ where: { id: sub.targetId }, data: changes });
        } else if (sub.operation === 'DELETE') {
          if (!sub.targetId) throw new ForbiddenException('Missing targetId for delete');
          await this.prisma.playerTrophy.delete({ where: { id: sub.targetId } });
        }
        break;
      }
      case SubmissionTargetType.ODD: {
        if (sub.operation === 'CREATE') await this.prisma.odd.create({ data: changes });
        else if (sub.operation === 'UPDATE') {
          if (!sub.targetId) throw new ForbiddenException('Missing targetId for update');
          await this.prisma.odd.update({ where: { id: sub.targetId }, data: changes });
        } else if (sub.operation === 'DELETE') {
          if (!sub.targetId) throw new ForbiddenException('Missing targetId for delete');
          await this.prisma.odd.delete({ where: { id: sub.targetId } });
        }
        break;
      }
      default:
        // leave other types for later
        break;
    }

    // Mark approved and create review
    return this.prisma.$transaction(async (tx) => {
      await tx.review.create({
        data: {
          reviewerId,
          submissionId: sub.id,
          decision: ModerationStatus.APPROVED,
          comment: comment ?? null,
        },
      });
      return tx.submission.update({ where: { id: sub.id }, data: { status: ModerationStatus.APPROVED } });
    });
  }

  async reject(params: { submissionId: number; reviewerId: number; comment?: string }): Promise<Submission> {
    const { submissionId, reviewerId, comment } = params;
    const sub = await this.getById(submissionId);
    if (sub.status !== ModerationStatus.PENDING) {
      throw new ForbiddenException('Submission already decided');
    }
    return this.prisma.$transaction(async (tx) => {
      await tx.review.create({
        data: {
          reviewerId,
          submissionId: sub.id,
          decision: ModerationStatus.REJECTED,
          comment: comment ?? null,
        },
      });
      return tx.submission.update({ where: { id: sub.id }, data: { status: ModerationStatus.REJECTED } });
    });
  }
}


