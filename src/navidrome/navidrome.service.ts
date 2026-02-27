import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AlbumID3,
  ArtistID3,
  ArtistWithAlbumsID3,
  Child as SongID3,
  SubsonicAPI,
} from 'subsonic-api';

export type FormattedArtist = Pick<
  ArtistID3,
  'albumCount' | 'coverArt' | 'id' | 'name'
> & { album?: FormattedAlbum[] };

export type FormattedAlbum = Pick<
  AlbumID3,
  'artists' | 'coverArt' | 'id' | 'name' | 'year'
>;

export type FormattedSong = Pick<
  SongID3,
  | 'album'
  | 'albumArtists'
  | 'artists'
  | 'coverArt'
  | 'duration'
  | 'id'
  | 'title'
  | 'track'
  | 'year'
>;

@Injectable()
export class NavidromeService {
  private readonly logger = new Logger(NavidromeService.name);
  readonly api: SubsonicAPI;

  constructor(private configService: ConfigService) {
    const subsonicConfig = {
      url: configService.get<string>('NAVIDROME_URL')!,
      auth: {
        username: configService.get<string>('NAVIDROME_USER')!,
        password: configService.get<string>('NAVIDROME_PASSWORD')!,
      },
      post: true,
    };

    // Instantiate our subsonic connection
    this.api = new SubsonicAPI(subsonicConfig);

    // Test our connection
    this.api
      .ping()
      .then((res) =>
        this.logger.log(
          `Connected to instance at '${subsonicConfig.url}': ${JSON.stringify(res)}`,
        ),
      )
      .catch((err) => {
        this.logger.error(
          `Unable to connect to server '${subsonicConfig.url}': ${err}`,
        );
        throw new InternalServerErrorException(
          `Failed to connect to server '${subsonicConfig.url}': ${JSON.stringify(err)}`,
        );
      });
  }

  /* Helper Methods */

  /**
   * Formats an Album returned from the SubSonic API, keeping specific fields
   * @param album The Album returned from the SubSonic API
   * @returns Updated Album with selected fields
   */
  formatAlbum(album: AlbumID3): FormattedAlbum {
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
  formatArtist(artist: ArtistID3): FormattedArtist;
  formatArtist(artist: ArtistWithAlbumsID3): FormattedArtist;
  formatArtist(artist: ArtistID3 & ArtistWithAlbumsID3): FormattedArtist {
    const { albumCount, album, coverArt, id, name } = artist;

    return {
      album: album?.map((album) => this.formatAlbum(album)),
      albumCount,
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
  formatSong(song: SongID3): FormattedSong {
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
}
