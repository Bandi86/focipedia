import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransfersService {
  constructor(private prisma: PrismaService) {}

  create(createTransferDto: any) {
    return this.prisma.transfer.create({ data: createTransferDto });
  }

  findAll() {
    return this.prisma.transfer.findMany();
  }

  findOne(id: number) {
    return this.prisma.transfer.findUnique({ where: { id } });
  }

  update(id: number, updateTransferDto: any) {
    return this.prisma.transfer.update({ where: { id }, data: updateTransferDto });
  }

  remove(id: number) {
    return this.prisma.transfer.delete({ where: { id } });
  }
}
