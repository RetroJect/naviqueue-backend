<!-- omit from toc -->
# NaviQueue Backend

A [Twitch](https://twitch.tv) authenticated application that let's viewers request music from a broadcaster's hosted [Navidrome](https://www.navidrome.org) music server.
This application is based on the [Nest](https://github.com/nestjs/nest) framework and serves as the coordinator.
The [NaviQueue UI][naviqueue_ui] and NaviQueue Worker are separate applications that work in tandem with the backend to manage and play requested media.
For more information on the application design [see here](#services).

> Note: This project is not affiliated with Twitch or Navidrome

- [Services](#services)
- [Running](#running)
  - [Environment Configuration](#environment-configuration)
  - [Local Deployment](#local-deployment)
- [Development](#development)

## Services

- Backend (You're Here)
  - Viewer Twitch Authentication
  - Chat Commands
  - Music Queue Management
- [UI][naviqueue_ui]
  - Request Songs
  - View current playing track
  - View play queue
- Worker
  - Receives updates from the backend on queue changes
  - Communicates with a player to control it's local queue
  - Workers can be made for any player that supports SubSonic
    - [Feishin Worker][naviqueue_worker_feishin]

## Running

### Environment Configuration

On startup the backend will attempt to read configuration details from either the system environment or from a `.env` file located in the root of the project.
Environment variables used by the application are listed in the table below.

|Variable Name|Default Value|Required|Description|
|-------------|-------------|:------:|-----------|
|CORS_DOMAINS|`localhost`||CORS allowed domains. Can be a list split by `,`. Example: `localhost,my.domain.com`|
|PORT|`3000`||The port used by the API|
|MONGO_DB_URI|`mongodb://localhost:27017/naviqueue`||The connection URI used for MongoDB|
|NAVIDROME_URL||:white_check_mark:|The URL of your Navidrome (or SubSonic compatible) server|
|NAVIDROME_USER||:white_check_mark:|The account's username used to connect|
|NAVIDROME_PASSWORD||:white_check_mark:|The account's password used to connect|
|TWITCH_CLIENT_ID||:white_check_mark:|Your Twitch application Client ID|
|TWITCH_CLIENT_SECRET||:white_check_mark:|Your Twitch application Client Secret|
|TWITCH_CALLBACK_URL||:white_check_mark:|URL configured in your Twitch application that's allowed to accept the OAuth callback|
|TWITCH_CHAT_CHANNEL||:white_check_mark:|The broadcaster's channel the chat bot should connect to|
|JWT_SECRET|Base64 encoded 31 random bytes||The secret key used to sign the JWTs. Should be manually set to a cryptographically strong passphrase|
|JWT_LIFETIME_SECONDS|`86400`||The length in seconds the JWT is valid for|

### Local Deployment

To run the application locally follow these steps:

1. Install dependencies

    ```bash
    npm install --production
    ```

2. Configure required environment variables with a `.env` file. See the table above for required variables.
3. Run an instance of MongoDB
4. Launch your Worker(s)
5. Launch the application

    ```bash
    npm run start:prod
    ```

## Development

```bash
npm install
```

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

<!-- Links -->

[naviqueue_ui]:https://github.com/RetroJect/naviqueue-ui
[naviqueue_worker_feishin]:https://github.com/RetroJect/naviqueue-worker-feishin
