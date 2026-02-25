import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt.guard';
import { Request } from 'express';
import { UserDocument } from './users/user.schema';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(JwtAuthGuard)
  @Get('whoami')
  getWhoami(@Req() { user }: Request & { user: UserDocument }) {
    return user.toJSON({
      aliases: false,
      minimize: false,
      versionKey: false,
    });
  }
}
