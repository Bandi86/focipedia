import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import {
  databaseConfig,
  jwtConfig,
  redisConfig,
  serverConfig,
  corsConfig,
  securityConfig,
  emailConfig,
  loggingConfig,
} from './config/configuration';
import { databaseProviders } from './config/database.providers';
import { redisProviders } from './config/redis.providers';

import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ProfileModule } from './modules/profile/profile.module';
import { SettingsModule } from './modules/settings/settings.module';
import { GatewayModule } from './modules/gateway/gateway.module';
import { PostModule } from './modules/post/post.module';
import { CommentModule } from './modules/comment/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [
        databaseConfig,
        jwtConfig,
        redisConfig,
        serverConfig,
        corsConfig,
        securityConfig,
        emailConfig,
        loggingConfig,
      ],
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    ProfileModule,
    SettingsModule,
    GatewayModule,
    PostModule,
    CommentModule,
  ],
  providers: [...databaseProviders, ...redisProviders],
})
export class AppModule {}