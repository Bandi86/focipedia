import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService, @Inject('CACHE_MANAGER') private cache: Cache) {}

  create(createTeamDto: CreateTeamDto) {
    return this.prisma.team.create({ data: createTeamDto });
  }

  async findAll(p: PaginationDto) {
    const page = p.page ?? 1;
    const limit = p.limit ?? 20;
    const skip = (page - 1) * limit;
    const orderBy = p.sortBy ? { [p.sortBy]: p.sortOrder ?? 'asc' } : { createdAt: 'desc' as const };
    const key = `teams:list:${page}:${limit}:${p.sortBy ?? 'createdAt'}:${p.sortOrder ?? 'desc'}`;
    const cached = await this.cache.get(key);
    if (cached) return cached as any;
    const data = await this.prisma.team.findMany({ skip, take: limit, orderBy });
    await this.cache.set(key, data, 60_000);
    return data;
  }

  findOne(id: number) {
    return this.prisma.team.findUnique({ where: { id } });
  }

  update(id: number, updateTeamDto: UpdateTeamDto) {
    return this.prisma.team.update({ where: { id }, data: updateTeamDto });
  }

  remove(id: number) {
    return this.prisma.team.delete({ where: { id } });
  }

  async recentForm(teamId: number, limit = 5) {
    const cacheKey = `teams:form:${teamId}:${limit}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached as any;
    const matches = await this.prisma.match.findMany({
      where: { OR: [{ homeTeamId: teamId }, { awayTeamId: teamId }], status: 'Finished' as any },
      orderBy: { matchDate: 'desc' },
      take: limit,
      include: { homeTeam: { select: { id: true, name: true } }, awayTeam: { select: { id: true, name: true } } },
    });
    const form = matches.map((m) => {
      const isHome = m.homeTeamId === teamId;
      const gf = m.homeScore ?? 0;
      const ga = m.awayScore ?? 0;
      const myGF = isHome ? gf : (m.awayScore ?? 0);
      const myGA = isHome ? ga : (m.homeScore ?? 0);
      const res = myGF > myGA ? 'W' : myGF === myGA ? 'D' : 'L';
      const opponentName = isHome ? (m.awayTeam?.name ?? '–') : (m.homeTeam?.name ?? '–');
      return { id: m.id, date: m.matchDate, result: res as 'W' | 'D' | 'L', opponent: opponentName, gf: myGF, ga: myGA };
    });
    await this.cache.set(cacheKey, form, 60_000);
    return form;
  }
}
