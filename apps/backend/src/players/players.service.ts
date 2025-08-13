import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PlayersService {
  constructor(private prisma: PrismaService) {}

  create(createPlayerDto: any) {
    return this.prisma.player.create({ data: createPlayerDto });
  }

  findAll() {
    return this.prisma.player.findMany();
  }

  findOne(id: number) {
    return this.prisma.player.findUnique({ where: { id } });
  }

  update(id: number, updatePlayerDto: any) {
    return this.prisma.player.update({ where: { id }, data: updatePlayerDto });
  }

  remove(id: number) {
    return this.prisma.player.delete({ where: { id } });
  }
}
