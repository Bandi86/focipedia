import { Module } from '@nestjs/common';
import { PlayerSeasonStatsController } from './player-season-stats.controller';
import { PlayerSeasonStatsService } from './player-season-stats.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PlayerSeasonStatsController],
  providers: [PlayerSeasonStatsService],
})
export class PlayerSeasonStatsModule {}
