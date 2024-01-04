import { Module } from '@nestjs/common';
import { MainService } from './main.service';
import { MainController } from './main.controller';

@Module({
  providers: [MainService],
  controllers: [MainController]
})
export class MainModule {}
