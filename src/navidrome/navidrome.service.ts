import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SubsonicAPI } from 'subsonic-api';

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
}
