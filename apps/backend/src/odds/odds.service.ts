import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OddsService {
  constructor(private prisma: PrismaService) {}

  create(createOddDto: any) {
    return this.prisma.odd.create({ data: createOddDto });
  }

  findAll() {
    return this.prisma.odd.findMany();
  }

  findOne(id: number) {
    return this.prisma.odd.findUnique({ where: { id } });
  }

  update(id: number, updateOddDto: any) {
    return this.prisma.odd.update({ where: { id }, data: updateOddDto });
  }

  remove(id: number) {
    return this.prisma.odd.delete({ where: { id } });
  }
}
