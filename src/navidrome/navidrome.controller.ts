import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  Query,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import {
  AlbumID3,
  ArtistWithAlbumsID3,
  Child as SongID3,
  SearchResult3,
  SubsonicBaseResponse,
} from 'subsonic-api';
import { NavidromeService } from './navidrome.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ResolveIdPipe } from './pipes/resolveId.pipe';

@Controller('music')
@UseGuards(JwtAuthGuard)
export class NavidromeController {
  private readonly logger = new Logger(NavidromeController.name);

  constructor(private server: NavidromeService) {}

  @Get('album/:id')
  getAlbumById(@Param('id', ResolveIdPipe('album')) album: AlbumID3 | null) {
    if (album === null) {
      throw new BadRequestException({
        success: false,
        message: 'Unable to find Album by ID',
      });
    }

    return {
      success: true,
      result: this.server.formatAlbum(album),
    };
  }

  @Get('artist/:id')
  getArtistById(
    @Param('id', ResolveIdPipe('artist')) artist: ArtistWithAlbumsID3 | null,
  ) {
    if (artist === null) {
      throw new BadRequestException({
        success: false,
        message: 'Unable to find Artist by ID',
      });
    }

    return {
      success: true,
      result: this.server.formatArtist(artist),
    };
  }

  @Get('song/:id')
  getSongById(@Param('id', ResolveIdPipe('song')) song: SongID3 | null) {
    if (song === null) {
      throw new BadRequestException({
        success: false,
        message: 'Unable to find Song by ID',
      });
    }

    return {
      success: true,
      result: this.server.formatSong(song),
    };
  }

  @Get('coverArt/:id')
  getCoverArtById(
    @Param('id', ResolveIdPipe('coverArt'))
    coverArt: Uint8Array<ArrayBuffer> | null,
  ) {
    if (coverArt === null) {
      throw new BadRequestException({
        success: false,
        message: 'Unable to find Cover Art by ID',
      });
    }

    return new StreamableFile(coverArt, {
      type: 'image/bmp',
      disposition: 'inline',
    });
  }

  @Get('search')
  async getSearch(@Query('query') query: string) {
    let results: SubsonicBaseResponse & { searchResult3: SearchResult3 };

    try {
      results = await this.server.api.search3({ query });
    } catch (error) {
      this.logger.error(
        `Query to server failed with error: ${JSON.stringify(error)}`,
      );

      throw new InternalServerErrorException({
        success: false,
        message: 'Unable to query server, try again later.',
      });
    }

    // Something went wrong with our call
    if (results.status !== 'ok') {
      this.logger.error(
        `Query to Navidrome ended with status: ${results.status}`,
        { query },
      );

      throw new InternalServerErrorException({
        success: false,
        message: 'Unable to query server, try again later.',
      });
    }

    const filteredResults = {
      album: results.searchResult3?.album?.map((album) =>
        this.server.formatAlbum(album),
      ),
      artist: results.searchResult3?.artist?.map((artist) =>
        this.server.formatArtist(artist),
      ),
      song: results.searchResult3?.song?.map((song) =>
        this.server.formatSong(song),
      ),
    };

    return {
      success: true,
      results: filteredResults,
    };
  }
}
