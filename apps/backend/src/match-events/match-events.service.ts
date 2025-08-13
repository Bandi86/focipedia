import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMatchEventDto } from './dto/create-match-event.dto';
import { UpdateMatchEventDto } from './dto/update-match-event.dto';

@Injectable()
export class MatchEventsService {
  constructor(private prisma: PrismaService) {}

  create(createMatchEventDto: CreateMatchEventDto) {
    return this.prisma.matchEvent.create({ data: createMatchEventDto });
  }

  findAll() {
    return this.prisma.matchEvent.findMany();
  }

  findOne(id: number) {
    return this.prisma.matchEvent.findUnique({ where: { id } });
  }

  update(id: number, updateMatchEventDto: UpdateMatchEventDto) {
    return this.prisma.matchEvent.update({ where: { id }, data: updateMatchEventDto });
  }

  remove(id: number) {
    return this.prisma.matchEvent.delete({ where: { id } });
  }
}
