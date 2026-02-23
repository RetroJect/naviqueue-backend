import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import * as Joi from 'joi';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class State {
  @JoiSchema(
    Joi.string().uri({ scheme: ['http', 'https'], allowRelative: true }),
  )
  redirectTo?: string;
}

@Injectable()
export class TwitchAuthGuard extends AuthGuard('twitch') {
  getAuthenticateOptions(context: ExecutionContext) {
    // For typescript we're assuming the request object will look something like this
    const request: { query?: { redirectTo?: string } } = context
      .switchToHttp()
      .getRequest();

    const state: State = {
      // Use the request's redirect if available
      redirectTo: request?.query?.redirectTo,
    };

    return {
      state: Buffer.from(JSON.stringify(state)).toString('base64'),
    };
  }
}
