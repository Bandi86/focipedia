import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';
import { Provider } from '@nestjs/common';

export const redisProviders: Provider[] = [
  {
    provide: 'REDIS_CLIENT',
    useFactory: async (configService: ConfigService) => {
      const client = createClient({
        url: configService.get('redis.url'),
      });

      await client.connect();
      return client;
    },
    inject: [ConfigService],
  },
];