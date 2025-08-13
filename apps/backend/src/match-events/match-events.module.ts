import { Module } from '@nestjs/common';
import { MatchEventsController } from './match-events.controller';
import { MatchEventsService } from './match-events.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MatchEventsController],
  providers: [MatchEventsService],
})
export class MatchEventsModule {}
