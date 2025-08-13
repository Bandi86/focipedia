import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LeaguesService {
  constructor(private prisma: PrismaService) {}

  create(createLeagueDto: any) {
    return this.prisma.league.create({ data: createLeagueDto });
  }

  findAll() {
    return this.prisma.league.findMany();
  }

  findOne(id: number) {
    return this.prisma.league.findUnique({ where: { id } });
  }

  update(id: number, updateLeagueDto: any) {
    return this.prisma.league.update({ where: { id }, data: updateLeagueDto });
  }

  remove(id: number) {
    return this.prisma.league.delete({ where: { id } });
  }
}
