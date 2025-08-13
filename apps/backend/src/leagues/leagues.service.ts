import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateLeagueDto } from './dto/create-league.dto';
import { UpdateLeagueDto } from './dto/update-league.dto';
import { MatchStatus } from '@prisma/client';

@Injectable()
export class LeaguesService {
  constructor(private prisma: PrismaService, @Inject('CACHE_MANAGER') private cache: Cache) {}

  create(createLeagueDto: CreateLeagueDto) {
    return this.prisma.league.create({ data: createLeagueDto });
  }

  async findAll(p: PaginationDto) {
    const page = p.page ?? 1;
    const limit = p.limit ?? 20;
    const skip = (page - 1) * limit;
    const orderBy = p.sortBy ? { [p.sortBy]: p.sortOrder ?? 'asc' } : { createdAt: 'desc' as const };
    const key = `leagues:list:${page}:${limit}:${p.sortBy ?? 'createdAt'}:${p.sortOrder ?? 'desc'}`;
    const cached = await this.cache.get(key);
    if (cached) return cached as any;
    const data = await this.prisma.league.findMany({ skip, take: limit, orderBy });
    await this.cache.set(key, data, 60_000);
    return data;
  }

  findOne(id: number) {
    return this.prisma.league.findUnique({ where: { id } });
  }

  update(id: number, updateLeagueDto: UpdateLeagueDto) {
    return this.prisma.league.update({ where: { id }, data: updateLeagueDto });
  }

  remove(id: number) {
    return this.prisma.league.delete({ where: { id } });
  }

  async standings(leagueId: number) {
    const cacheKey = `standings:${leagueId}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached as any;

    const matches = await this.prisma.match.findMany({
      where: { leagueId, status: MatchStatus.Finished },
      include: { homeTeam: true, awayTeam: true },
    });

    type Row = { teamId: number; teamName: string; played: number; won: number; drawn: number; lost: number; goalsFor: number; goalsAgainst: number; points: number };
    const table = new Map<number, Row>();
    const ensure = (id: number, name: string) => {
      if (!table.has(id)) table.set(id, { teamId: id, teamName: name, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 });
      return table.get(id)!;
    };
    for (const m of matches) {
      const home = ensure(m.homeTeamId, m.homeTeam.name);
      const away = ensure(m.awayTeamId, m.awayTeam.name);
      home.played++; away.played++;
      home.goalsFor += m.homeScore; home.goalsAgainst += m.awayScore;
      away.goalsFor += m.awayScore; away.goalsAgainst += m.homeScore;
      if (m.homeScore > m.awayScore) { home.won++; home.points += 3; away.lost++; }
      else if (m.homeScore < m.awayScore) { away.won++; away.points += 3; home.lost++; }
      else { home.drawn++; away.drawn++; home.points += 1; away.points += 1; }
    }
    const rows = Array.from(table.values()).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const gdA = a.goalsFor - a.goalsAgainst;
      const gdB = b.goalsFor - b.goalsAgainst;
      if (gdB !== gdA) return gdB - gdA;
      return b.goalsFor - a.goalsFor;
    }).map((r, idx) => ({ position: idx + 1, ...r }));

    await this.cache.set(cacheKey, rows, 60_000);
    return rows;
  }
}
