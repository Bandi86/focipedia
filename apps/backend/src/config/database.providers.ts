import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma.service';

export const databaseProviders = [
  {
    provide: PrismaClient,
    useFactory: async (configService: ConfigService) => {
      const prisma = new PrismaClient({
        datasources: {
          db: {
            url: configService.get('database.url'),
          },
        },
        log: configService.get('server.nodeEnv') === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
      });

      await prisma.$connect();
      return prisma;
    },
    inject: [ConfigService],
  },
];

export { PrismaService };