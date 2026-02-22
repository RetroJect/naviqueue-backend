import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TwitchStrategy } from './twitch.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'twitch' })],
  providers: [TwitchStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
