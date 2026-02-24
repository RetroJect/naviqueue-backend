import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { TwitchAuthGuard } from './twitch.guard';
import { AuthService } from './auth.service';
import { UserDocument } from '../users/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(TwitchAuthGuard)
  @Get('twitch')
  twitchAuth() {}

  @UseGuards(TwitchAuthGuard)
  @Get('twitch/callback')
  twitchAuthRedirect(@Req() req: { user: UserDocument }) {
    return this.authService.login(req.user);
  }
}
