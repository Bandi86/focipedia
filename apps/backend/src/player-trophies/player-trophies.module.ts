import { Module } from '@nestjs/common';
import { PlayerTrophiesController } from './player-trophies.controller';
import { PlayerTrophiesService } from './player-trophies.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PlayerTrophiesController],
  providers: [PlayerTrophiesService],
})
export class PlayerTrophiesModule {}
