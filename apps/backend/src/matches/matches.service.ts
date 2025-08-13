import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MatchStatus } from '@prisma/client';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class MatchesService {
  constructor(private prisma: PrismaService, @Inject('CACHE_MANAGER') private cache: Cache) {}

  create(createMatchDto: { matchDate: string; stadium?: string; round?: string; isCup?: boolean; status: MatchStatus; homeTeamId: number; awayTeamId: number; leagueId: number; homeScore?: number; awayScore?: number }) {
    return this.prisma.match.create({ data: createMatchDto });
  }

  async findAll(p: PaginationDto, leagueId?: number) {
    const page = p.page ?? 1;
    const limit = p.limit ?? 20;
    const skip = (page - 1) * limit;
    const orderBy = p.sortBy ? { [p.sortBy]: p.sortOrder ?? 'asc' } : { matchDate: 'desc' as const };
    const cacheKey = `matches:list:${page}:${limit}:${p.sortBy ?? 'matchDate'}:${p.sortOrder ?? 'desc'}:${leagueId ?? 'all'}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached as any;
    const data = await this.prisma.match.findMany({
      skip,
      take: limit,
      orderBy,
      where: leagueId ? { leagueId } : undefined,
      include: {
        homeTeam: true,
        awayTeam: true,
        league: true,
        odds: true,
      },
    });
    await this.cache.set(cacheKey, data, 30_000);
    return data;
  }

  async findPublicMatches() {
    const cacheKey = `matches:public`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached as any;
    const data = await this.prisma.match.findMany({
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
    await this.cache.set(cacheKey, data, 30_000);
    return data;
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

  async findUpcomingMatches() {
    const cacheKey = `matches:upcoming`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached as any;
    const data = await this.prisma.match.findMany({
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
    await this.cache.set(cacheKey, data, 30_000);
    return data;
  }

  async findLiveMatches() {
    const cacheKey = `matches:live`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached as any;
    const data = await this.prisma.match.findMany({
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
    await this.cache.set(cacheKey, data, 15_000);
    return data;
  }

  async findFinishedMatches() {
    const cacheKey = `matches:finished`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached as any;
    const data = await this.prisma.match.findMany({
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
    await this.cache.set(cacheKey, data, 60_000);
    return data;
  }

  update(id: number, updateMatchDto: Partial<{ matchDate: string; stadium?: string; round?: string; isCup?: boolean; status: MatchStatus; homeTeamId: number; awayTeamId: number; leagueId: number; homeScore?: number; awayScore?: number }>) {
    return this.prisma.match.update({ where: { id }, data: updateMatchDto });
  }

  remove(id: number) {
    return this.prisma.match.delete({ where: { id } });
  }
}
