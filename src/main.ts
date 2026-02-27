import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: (process.env?.CORS_DOMAINS ?? 'localhost')
        .split(',')
        .map((host) => host.trim()),
    },
  });

  // Parse request cookies
  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
