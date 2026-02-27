import {
  Injectable,
  InternalServerErrorException,
  Logger,
  mixin,
  PipeTransform,
  Type,
} from '@nestjs/common';
import { NavidromeService } from '../navidrome.service';

/**
 * Resolves an ID into its associated type and value
 * @param type The type of ID to resolve
 * @returns The resolved value based on the ID
 */
export const ResolveIdPipe = (
  type: 'album' | 'artist' | 'coverArt' | 'song',
): Type<PipeTransform> => {
  @Injectable()
  class MixinResolveIdPipe implements PipeTransform {
    private readonly logger = new Logger(ResolveIdPipe.name);

    constructor(private readonly server: NavidromeService) {}

    async getArtist(id: string) {
      const result = await this.server.api.getArtist({ id });

      if (result.status !== 'ok') return null;

      return result.artist;
    }

    async getAlbum(id: string) {
      const result = await this.server.api.getAlbum({ id });

      if (result.status !== 'ok') return null;

      return result.album;
    }

    async getSong(id: string) {
      const result = await this.server.api.getSong({ id });

      if (result.status !== 'ok') return null;

      return result.song;
    }

    async getCoverArt(id: string) {
      const result = await this.server.api.getCoverArt({ id });

      return await result.bytes();
    }

    async transform(id: string) {
      try {
        switch (type) {
          case 'artist':
            return await this.getArtist(id);
          case 'album':
            return await this.getAlbum(id);
          case 'song':
            return await this.getSong(id);
          case 'coverArt':
            return await this.getCoverArt(id);
        }
      } catch (error) {
        this.logger.error(
          `Unable to resolve ${type} id '${id}': ${JSON.stringify(error)}`,
        );

        throw new InternalServerErrorException({
          success: false,
          message: `Unable to find ${type} by id, try again later.`,
        });
      }
    }
  }

  return mixin(MixinResolveIdPipe);
};
