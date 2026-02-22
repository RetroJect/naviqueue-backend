import { Controller, Get, Redirect, UseGuards } from '@nestjs/common';
import { TwitchAuthGuard } from './twitch.guard';

@Controller('auth')
export class AuthController {
  @UseGuards(TwitchAuthGuard)
  @Get('twitch')
  twitchAuth() {}

  @UseGuards(TwitchAuthGuard)
  @Get('twitch/callback')
  @Redirect('/')
  twitchAuthRedirect() {
    // TODO: Redirect to UI home if originates from UI
    // return { url: 'https://ui-host/' }
  }
}
