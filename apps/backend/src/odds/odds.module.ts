import { Module } from '@nestjs/common';
import { OddsController } from './odds.controller';
import { OddsService } from './odds.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [OddsController],
  providers: [OddsService],
})
export class OddsModule {}
