import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TwitchStrategy } from './twitch.strategy';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/user.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'twitch' }),
    UsersModule,
  ],
  providers: [TwitchStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
