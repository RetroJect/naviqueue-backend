import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { TwitchAuthGuard } from './twitch.guard';
import { AuthService } from './auth.service';
import { UserDocument } from '../users/user.schema';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @UseGuards(TwitchAuthGuard)
  @Get('twitch')
  twitchAuth() {}

  @UseGuards(TwitchAuthGuard)
  @Get('twitch/callback')
  twitchAuthRedirect(
    @Req() req: { user: UserDocument },
    @Res({ passthrough: true }) res: Response,
  ) {
    const jwt = this.authService.login(req.user);

    res.cookie('jwt', jwt, {
      domain: this.configService.get<string>('UI_DOMAIN'),
      httpOnly: true,
      secure: true,
    });

    return {
      success: true,
      accessToken: jwt,
    };
  }
}
