import { Module } from '@nestjs/common';
import { PlayerMatchStatsController } from './player-match-stats.controller';
import { PlayerMatchStatsService } from './player-match-stats.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PlayerMatchStatsController],
  providers: [PlayerMatchStatsService],
})
export class PlayerMatchStatsModule {}
