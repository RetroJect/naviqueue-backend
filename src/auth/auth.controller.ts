import {
  ArgumentMetadata,
  BadRequestException,
  Controller,
  Get,
  PipeTransform,
  Query,
  Redirect,
  UseGuards,
} from '@nestjs/common';
import { State as QueryState, TwitchAuthGuard } from './twitch.guard';
import { JoiPipe } from 'nestjs-joi';

// Decodes a base64 string
class Base64DecodePipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata) {
    try {
      return Buffer.from(value, 'base64').toString();
    } catch (error) {
      console.error('Unable to decode provided string as base64', error);
      throw new BadRequestException(
        `Base64 decode failed for ${metadata.type} ${metadata.data ?? 'parameter'}`,
      );
    }
  }
}

// Parses a JSON string into the requested type, throwing on error
class JSONParsePipe<T> implements PipeTransform<string, T> {
  transform(value: string): T {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const parsed: T = JSON.parse(value);
      return parsed;
    } catch (error) {
      console.error(`Failed to parse JSON ${value} from string`, error);
      throw new BadRequestException('Unable to parse provided string as JSON');
    }
  }
}

@Controller('auth')
export class AuthController {
  @UseGuards(TwitchAuthGuard)
  @Get('twitch')
  twitchAuth() {}

  @UseGuards(TwitchAuthGuard)
  @Get('twitch/callback')
  @Redirect()
  twitchAuthRedirect(
    @Query(
      'state',
      new Base64DecodePipe(), // Decode our state into a string
      new JSONParsePipe<QueryState>(), // Parse the string into an object
      JoiPipe, // Validate the state
    )
    state?: QueryState,
  ) {
    return { url: state?.redirectTo ?? '/' };
  }
}
