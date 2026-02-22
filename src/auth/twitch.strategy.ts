import { Strategy } from 'passport-twitch-new';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type RawTwitchPassportProfile = {
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

export type TwitchProfile = {
  broadcasterType: 'affiliate' | 'partner' | '';
  createdAt: string;
  description: string;
  displayName: string;
  email?: string;
  id: string;
  login: string;
  offlineImageURL: string;
  profileImageURL: string;
  type: 'admin' | 'global_mod' | 'staff' | '';
  viewCount?: number;
};

export type UserData = {
  profile: TwitchProfile;
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class TwitchStrategy extends PassportStrategy(Strategy, 'twitch') {
  constructor(private configService: ConfigService) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      clientID: configService.get<string>('TWITCH_CLIENT_ID'),
      clientSecret: configService.get<string>('TWITCH_CLIENT_SECRET'),
      callbackURL: configService.get<string>('TWITCH_CALLBACK_URL'),
      scope: 'user_read',
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    {
      broadcaster_type: broadcasterType,
      created_at: createdAt,
      display_name: displayName,
      offline_image_url: offlineImageURL,
      profile_image_url: profileImageURL,
      view_count: viewCount,
      ...rest
    }: RawTwitchPassportProfile,
  ): UserData {
    return {
      profile: {
        broadcasterType,
        createdAt,
        displayName,
        offlineImageURL,
        profileImageURL,
        viewCount,
        ...rest,
      },
      accessToken,
      refreshToken,
    };
  }
}
