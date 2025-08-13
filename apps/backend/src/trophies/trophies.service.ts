import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTrophyDto } from './dto/create-trophy.dto';
import { UpdateTrophyDto } from './dto/update-trophy.dto';

@Injectable()
export class TrophiesService {
  constructor(private prisma: PrismaService) {}

  create(createTrophyDto: CreateTrophyDto) {
    return this.prisma.trophy.create({ data: createTrophyDto });
  }

  findAll() {
    return this.prisma.trophy.findMany();
  }

  findOne(id: number) {
    return this.prisma.trophy.findUnique({ where: { id } });
  }

  update(id: number, updateTrophyDto: UpdateTrophyDto) {
    return this.prisma.trophy.update({ where: { id }, data: updateTrophyDto });
  }

  remove(id: number) {
    return this.prisma.trophy.delete({ where: { id } });
  }
}
