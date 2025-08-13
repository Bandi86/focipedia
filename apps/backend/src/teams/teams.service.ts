import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  create(createTeamDto: any) {
    return this.prisma.team.create({ data: createTeamDto });
  }

  findAll() {
    return this.prisma.team.findMany();
  }

  findOne(id: number) {
    return this.prisma.team.findUnique({ where: { id } });
  }

  update(id: number, updateTeamDto: any) {
    return this.prisma.team.update({ where: { id }, data: updateTeamDto });
  }

  remove(id: number) {
    return this.prisma.team.delete({ where: { id } });
  }
}
