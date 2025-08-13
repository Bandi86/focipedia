import { Module } from '@nestjs/common';
import { TrophiesController } from './trophies.controller';
import { TrophiesService } from './trophies.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TrophiesController],
  providers: [TrophiesService],
})
export class TrophiesModule {}
