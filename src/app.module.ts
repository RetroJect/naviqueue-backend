import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import Joi from 'joi';
import { TWURPLE_AUTH_PROVIDER, TwurpleAuthModule } from '@nestjs-twurple/auth';
import { RefreshingAuthProvider } from '@twurple/auth';
import { TwurpleApiModule } from '@nestjs-twurple/api';
import { TwurpleChatModule } from '@nestjs-twurple/chat';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // Reads environment variables or .env
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: Joi.object({
        MONGO_DB_URI: Joi.string()
          .uri()
          .default('mongodb://localhost:27017/naviqueue'),
        PORT: Joi.number().port().default(3000),
        TWITCH_CLIENT_ID: Joi.string().required(),
        TWITCH_CLIENT_SECRET: Joi.string().required(),
        TWITCH_CALLBACK_URL: Joi.string().uri().required(),
        TWITCH_CHAT_CHANNEL: Joi.string().required(),
      }),
    }),

    // Connect to MongoDB instance
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          uri: configService.getOrThrow('MONGO_DB_URI'),
        };
      },
    }),

    // Creates automatically refreshing account credentials
    TwurpleAuthModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'refreshing',
          clientId: configService.getOrThrow('TWITCH_CLIENT_ID'),
          clientSecret: configService.getOrThrow('TWITCH_CLIENT_SECRET'),
        };
      },
    }),
    // Global Twitch API module that uses the above account
    TwurpleApiModule.registerAsync({
      isGlobal: true,
      inject: [TWURPLE_AUTH_PROVIDER],
      useFactory: (authProvider: RefreshingAuthProvider) => ({ authProvider }),
    }),
    // Global Twitch Chat module that uses the above account
    TwurpleChatModule.registerAsync({
      isGlobal: true,
      inject: [TWURPLE_AUTH_PROVIDER, ConfigService],
      useFactory: (
        authProvider: RefreshingAuthProvider,
        configService: ConfigService,
      ) => ({
        authProvider,
        webSocket: true,
        channels: configService.get('TWITCH_CHAT_CHANNEL'),
      }),
    }),

    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
