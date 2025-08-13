import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
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
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SubmissionsModule } from './submissions/submissions.module';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        const redisUrl = process.env.REDIS_URL;
        if (redisUrl) {
          try {
            const { redisStore } = await import('cache-manager-redis-yet');
            return {
              store: await redisStore({ url: redisUrl }),
              ttl: 30,
              max: 1000,
            } as any;
          } catch (e) {
            // Fallback to in-memory cache if Redis is unavailable in dev
            // eslint-disable-next-line no-console
            console.warn('Redis unavailable, falling back to in-memory cache. Set REDIS_URL to enable Redis.');
          }
        }
        return { ttl: 30, max: 1000 } as any;
      },
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 120,
      },
    ]),
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
    AuthModule,
    UsersModule,
    SubmissionsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_GUARD',
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
