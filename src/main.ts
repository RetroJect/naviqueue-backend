import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: (process.env?.CORS_DOMAINS ?? 'localhost')
        .split(',')
        .map((host) => host.trim()),
    },
  });

  // Configure Express to trust available proxies
  app.set(
    'trust proxy',
    (process.env?.TRUST_PROXIES ?? '127.0.0.1')
      .split(',')
      .map((host) => host.trim()),
  );

  // Parse request cookies
  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
