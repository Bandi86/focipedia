import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';

@Injectable()
export class PlayersService {
  constructor(private prisma: PrismaService, @Inject('CACHE_MANAGER') private cache: Cache) {}

  create(createPlayerDto: CreatePlayerDto) {
    return this.prisma.player.create({ data: createPlayerDto });
  }

  async findAll(p: PaginationDto) {
    const page = p.page ?? 1;
    const limit = p.limit ?? 20;
    const skip = (page - 1) * limit;
    const orderBy = p.sortBy ? { [p.sortBy]: p.sortOrder ?? 'asc' } : { createdAt: 'desc' as const };
    const key = `players:list:${page}:${limit}:${p.sortBy ?? 'createdAt'}:${p.sortOrder ?? 'desc'}`;
    const cached = await this.cache.get(key);
    if (cached) return cached as any;
    const data = await this.prisma.player.findMany({ skip, take: limit, orderBy });
    await this.cache.set(key, data, 60_000);
    return data;
  }

  findOne(id: number) {
    return this.prisma.player.findUnique({ where: { id } });
  }

  update(id: number, updatePlayerDto: UpdatePlayerDto) {
    return this.prisma.player.update({ where: { id }, data: updatePlayerDto });
  }

  remove(id: number) {
    return this.prisma.player.delete({ where: { id } });
  }
}
