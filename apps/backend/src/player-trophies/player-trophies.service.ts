import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PlayerTrophiesService {
  constructor(private prisma: PrismaService) {}

  create(createPlayerTrophyDto: any) {
    return this.prisma.playerTrophy.create({ data: createPlayerTrophyDto });
  }

  findAll() {
    return this.prisma.playerTrophy.findMany();
  }

  findOne(id: number) {
    return this.prisma.playerTrophy.findUnique({ where: { id } });
  }

  update(id: number, updatePlayerTrophyDto: any) {
    return this.prisma.playerTrophy.update({ where: { id }, data: updatePlayerTrophyDto });
  }

  remove(id: number) {
    return this.prisma.playerTrophy.delete({ where: { id } });
  }
}
