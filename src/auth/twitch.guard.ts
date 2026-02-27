import { ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard, IAuthModuleOptions } from '@nestjs/passport';
import type { Request } from 'express';

@Injectable()
export class TwitchAuthGuard extends AuthGuard('twitch') {
  constructor(private configService: ConfigService) {
    super();
  }

  getAuthenticateOptions(context: ExecutionContext) {
    const { query, host, hostname }: Request = context
      .switchToHttp()
      .getRequest();

    const result: IAuthModuleOptions = {};

    // If the initiator was the UI, redirect back on auth failure
    const uiHost = this.configService.get<string>('UI_DOMAIN');
    if (hostname === uiHost) {
      result.failureRedirect = `https://${host}/login?failed=true`;
    }

    if (typeof query.next !== 'string') return result;

    // Store the redirect url in state for OAuth flow to be used later
    result.state = Buffer.from(query.next).toString('base64');

    return result;
  }
}
