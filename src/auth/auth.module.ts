import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TwitchStrategy } from './twitch.strategy';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/user.module';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'twitch' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<number>('JWT_LIFETIME_SECONDS'),
        },
      }),
    }),
  ],
  providers: [AuthService, TwitchStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
