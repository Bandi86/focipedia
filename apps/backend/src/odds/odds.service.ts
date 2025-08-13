import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOddDto } from './dto/create-odd.dto';
import { UpdateOddDto } from './dto/update-odd.dto';

@Injectable()
export class OddsService {
  constructor(private prisma: PrismaService) {}

  create(createOddDto: CreateOddDto) {
    return this.prisma.odd.create({ data: createOddDto });
  }

  findAll() {
    return this.prisma.odd.findMany();
  }

  findOne(id: number) {
    return this.prisma.odd.findUnique({ where: { id } });
  }

  update(id: number, updateOddDto: UpdateOddDto) {
    return this.prisma.odd.update({ where: { id }, data: updateOddDto });
  }

  remove(id: number) {
    return this.prisma.odd.delete({ where: { id } });
  }
}
