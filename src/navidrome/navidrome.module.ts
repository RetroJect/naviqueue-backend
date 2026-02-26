import { Module } from '@nestjs/common';
import { NavidromeService } from './navidrome.service';
import { NavidromeController } from './navidrome.controller';

@Module({
  providers: [NavidromeService],
  exports: [NavidromeService],
  controllers: [NavidromeController],
})
export class NavidromeModule {}
