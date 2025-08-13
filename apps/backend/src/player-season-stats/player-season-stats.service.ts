import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlayerSeasonStatDto } from './dto/create-player-season-stat.dto';
import { UpdatePlayerSeasonStatDto } from './dto/update-player-season-stat.dto';

@Injectable()
export class PlayerSeasonStatsService {
  constructor(private prisma: PrismaService) {}

  create(createPlayerSeasonStatDto: CreatePlayerSeasonStatDto) {
    return this.prisma.playerSeasonStats.create({ data: createPlayerSeasonStatDto });
  }

  findAll() {
    return this.prisma.playerSeasonStats.findMany();
  }

  findOne(id: number) {
    return this.prisma.playerSeasonStats.findUnique({ where: { id } });
  }

  update(id: number, updatePlayerSeasonStatDto: UpdatePlayerSeasonStatDto) {
    return this.prisma.playerSeasonStats.update({ where: { id }, data: updatePlayerSeasonStatDto });
  }

  remove(id: number) {
    return this.prisma.playerSeasonStats.delete({ where: { id } });
  }
}
