import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PlayerSeasonStatsService {
  constructor(private prisma: PrismaService) {}

  create(createPlayerSeasonStatDto: any) {
    return this.prisma.playerSeasonStats.create({ data: createPlayerSeasonStatDto });
  }

  findAll() {
    return this.prisma.playerSeasonStats.findMany();
  }

  findOne(id: number) {
    return this.prisma.playerSeasonStats.findUnique({ where: { id } });
  }

  update(id: number, updatePlayerSeasonStatDto: any) {
    return this.prisma.playerSeasonStats.update({ where: { id }, data: updatePlayerSeasonStatDto });
  }

  remove(id: number) {
    return this.prisma.playerSeasonStats.delete({ where: { id } });
  }
}
