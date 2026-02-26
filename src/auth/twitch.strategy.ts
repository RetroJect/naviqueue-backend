import { Strategy } from 'passport-twitch-new';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/user.service';
import { UserDocument } from 'src/users/user.schema';

export type RawTwitchPassportProfile = {
  id: string;
  login: string;
  display_name: string;
  type: 'admin' | 'global_mod' | 'staff' | '';
  broadcaster_type: 'affiliate' | 'partner' | '';
  description: string;
  profile_image_url: string;
  offline_image_url: string;
  view_count?: number;
  email?: string;
  created_at: string;
  provider: 'twitch';
};

@Injectable()
export class TwitchStrategy extends PassportStrategy(Strategy, 'twitch') {
  private readonly logger = new Logger(TwitchStrategy.name);

  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      clientID: configService.get<string>('TWITCH_CLIENT_ID'),
      clientSecret: configService.get<string>('TWITCH_CLIENT_SECRET'),
      callbackURL: configService.get<string>('TWITCH_CALLBACK_URL'),
      scope: 'user_read',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    user: RawTwitchPassportProfile,
  ): Promise<UserDocument | null> {
    try {
      const userDoc = await this.usersService.createOrUpdateFromRaw(
        accessToken,
        refreshToken,
        user,
      );

      return userDoc;
    } catch (error) {
      this.logger.error(`Unable to validate user ${user.id}`, error);

      return null;
    }
  }
}
