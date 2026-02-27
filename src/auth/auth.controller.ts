import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { JoiPipe } from 'nestjs-joi';
import * as Joi from 'joi';
import { TwitchAuthGuard } from './twitch.guard';
import { AuthService } from './auth.service';
import { UserDocument } from '../users/user.schema';
import { Base64DecodePipe } from 'src/pipes/base64.pipe';

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
    @Query(
      'state',
      new Base64DecodePipe({ optional: true }),
      new JoiPipe(
        // Only allow next addresses that are http(s) or '/relative/locations'
        Joi.string().uri({ scheme: ['http', 'https'], allowRelative: true }),
      ),
    )
    next?: string,
  ) {
    const jwt = this.authService.login(req.user);

    res.cookie('jwt', jwt, {
      domain: this.configService.get<string>('UI_DOMAIN'),
      httpOnly: true,
      secure: true,
    });

    // If we have a next parameter, follow it
    if (next) return res.redirect(next);

    return {
      success: true,
      accessToken: jwt,
    };
  }
}
