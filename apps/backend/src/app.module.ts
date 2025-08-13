import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// Test comment for husky pre-commit hook
import { TasksModule } from './tasks/tasks.module';
import { HealthModule } from './health/health.module';
import { TeamsModule } from './teams/teams.module';
import { PlayersModule } from './players/players.module';
import { LeaguesModule } from './leagues/leagues.module';
import { MatchesModule } from './matches/matches.module';
import { MatchEventsModule } from './match-events/match-events.module';
import { PlayerMatchStatsModule } from './player-match-stats/player-match-stats.module';
import { PlayerSeasonStatsModule } from './player-season-stats/player-season-stats.module';
import { TransfersModule } from './transfers/transfers.module';
import { TrophiesModule } from './trophies/trophies.module';
import { PlayerTrophiesModule } from './player-trophies/player-trophies.module';
import { OddsModule } from './odds/odds.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    TasksModule,
    HealthModule,
    TeamsModule,
    PlayersModule,
    LeaguesModule,
    MatchesModule,
    MatchEventsModule,
    PlayerMatchStatsModule,
    PlayerSeasonStatsModule,
    TransfersModule,
    TrophiesModule,
    PlayerTrophiesModule,
    OddsModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
