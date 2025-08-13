import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TrophiesService {
  constructor(private prisma: PrismaService) {}

  create(createTrophyDto: any) {
    return this.prisma.trophy.create({ data: createTrophyDto });
  }

  findAll() {
    return this.prisma.trophy.findMany();
  }

  findOne(id: number) {
    return this.prisma.trophy.findUnique({ where: { id } });
  }

  update(id: number, updateTrophyDto: any) {
    return this.prisma.trophy.update({ where: { id }, data: updateTrophyDto });
  }

  remove(id: number) {
    return this.prisma.trophy.delete({ where: { id } });
  }
}
