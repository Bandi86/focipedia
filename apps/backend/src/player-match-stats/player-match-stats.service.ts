import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PlayerMatchStatsService {
  constructor(private prisma: PrismaService) {}

  create(createPlayerMatchStatDto: any) {
    return this.prisma.playerMatchStats.create({ data: createPlayerMatchStatDto });
  }

  findAll() {
    return this.prisma.playerMatchStats.findMany();
  }

  findOne(id: number) {
    return this.prisma.playerMatchStats.findUnique({ where: { id } });
  }

  update(id: number, updatePlayerMatchStatDto: any) {
    return this.prisma.playerMatchStats.update({ where: { id }, data: updatePlayerMatchStatDto });
  }

  remove(id: number) {
    return this.prisma.playerMatchStats.delete({ where: { id } });
  }
}
