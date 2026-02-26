import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  AlbumID3,
  ArtistID3,
  Child as SongID3,
  SearchResult3,
  SubsonicBaseResponse,
} from 'subsonic-api';
import { NavidromeService } from './navidrome.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('music')
@UseGuards(JwtAuthGuard)
export class NavidromeController {
  private readonly logger = new Logger(NavidromeController.name);

  constructor(private server: NavidromeService) {}

  /* Helper Methods */

  /**
   * Formats an Album returned from the SubSonic API, keeping specific fields
   * @param album The Album returned from the SubSonic API
   * @returns Updated Album with selected fields
   */
  formatAlbum(album: AlbumID3) {
    const { coverArt, id, name, year, artists } = album;

    return {
      artists,
      coverArt,
      id,
      name,
      year,
    };
  }

  /**
   * Formats an Artist returned from the SubSonic API, keeping specific fields
   * @param artist The Artist returned from the SubSonic API
   * @returns Updated Artist with selected fields
   */
  formatArtist(artist: ArtistID3) {
    const { albumCount, artistImageUrl, coverArt, id, name } = artist;

    return {
      albumCount,
      artistImageUrl,
      coverArt,
      id,
      name,
    };
  }

  /**
   * Formats a Song returned from the SubSonic API, keeping specific fields
   * @param song The Song returned from the SubSonic API
   * @returns Updated Song with selected fields
   */
  formatSong(song: SongID3) {
    const {
      album,
      albumArtists,
      artists,
      coverArt,
      duration,
      id,
      title,
      track,
      year,
    } = song;

    return {
      album,
      albumArtists,
      artists,
      coverArt,
      duration,
      id,
      title,
      track,
      year,
    };
  }

  /* Routes */

  @Get('search')
  async search(@Query('query') query: string) {
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
        this.formatAlbum(album),
      ),
      artist: results.searchResult3?.artist?.map((artist) =>
        this.formatArtist(artist),
      ),
      song: results.searchResult3?.song?.map((song) => this.formatSong(song)),
    };

    return {
      success: true,
      results: filteredResults,
    };
  }
}
