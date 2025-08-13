import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MatchStatus } from '../../generated/prisma/client';

@Injectable()
export class MatchesService {
  constructor(private prisma: PrismaService) {}

  create(createMatchDto: any) {
    return this.prisma.match.create({ data: createMatchDto });
  }

  findAll() {
    return this.prisma.match.findMany({
      include: {
        homeTeam: true,
        awayTeam: true,
        league: true,
        odds: true,
      },
    });
  }

  findPublicMatches() {
    return this.prisma.match.findMany({
      where: {
        OR: [{ status: MatchStatus.Scheduled }, { status: MatchStatus.Live }],
      },
      orderBy: {
        matchDate: 'asc',
      },
      include: {
        homeTeam: true,
        awayTeam: true,
        league: true,
        odds: true,
      },
    });
  }

  async findOne(id: number) {
    const match = await this.prisma.match.findUnique({
      where: { id },
      include: {
        homeTeam: true,
        awayTeam: true,
        league: true,
        events: {
          include: {
            player: true,
            assistingPlayer: true,
            playerIn: true,
            playerOut: true,
          },
        },
        playerStats: {
          include: {
            player: true,
          },
        },
        odds: true,
      },
    });

    if (!match) {
      throw new NotFoundException(`Match with ID ${id} not found`);
    }
    return match;
  }

  async findMatchDetails(id: number) {
    const match = await this.prisma.match.findUnique({
      where: { id },
      include: {
        homeTeam: true,
        awayTeam: true,
        league: true,
        events: {
          include: {
            player: true,
            assistingPlayer: true,
            playerIn: true,
            playerOut: true,
          },
        },
        playerStats: {
          include: {
            player: true,
          },
        },
        odds: true,
      },
    });

    if (!match) {
      throw new NotFoundException(`Match with ID ${id} not found`);
    }
    return match;
  }

  findUpcomingMatches() {
    return this.prisma.match.findMany({
      where: {
        matchDate: {
          gte: new Date(),
        },
        status: MatchStatus.Scheduled,
      },
      orderBy: {
        matchDate: 'asc',
      },
      include: {
        homeTeam: true,
        awayTeam: true,
        league: true,
        odds: true,
      },
    });
  }

  findLiveMatches() {
    return this.prisma.match.findMany({
      where: {
        status: MatchStatus.Live,
      },
      include: {
        homeTeam: true,
        awayTeam: true,
        league: true,
        odds: true,
      },
    });
  }

  findFinishedMatches() {
    return this.prisma.match.findMany({
      where: {
        status: MatchStatus.Finished,
      },
      orderBy: {
        matchDate: 'desc',
      },
      include: {
        homeTeam: true,
        awayTeam: true,
        league: true,
        odds: true,
      },
    });
  }

  update(id: number, updateMatchDto: any) {
    return this.prisma.match.update({ where: { id }, data: updateMatchDto });
  }

  remove(id: number) {
    return this.prisma.match.delete({ where: { id } });
  }
}
