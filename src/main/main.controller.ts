import {
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  All,
  UseGuards,
} from '@nestjs/common';
import { MainService as MainServices } from './main.service';
import { isAdmin } from 'src/Guard/permission';

@Controller()
export class MainController {
  constructor(private readonly MainService: MainServices) {}

  @Get()
  @HttpCode(233)
  async list(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
    @Query('sortBy') sortBy: string,
    @Query('sortDesc') sortDesc: string,
    @Query('search') search: string,
  ) {
    return this.MainService.list(page, pageSize, sortBy, sortDesc, search);
  }

  @Post()
  @HttpCode(200)
  @UseGuards(isAdmin)
  post() {
    return this.MainService.indexPost();
  }

  @All()
  @HttpCode(666)
  all() {
    return this.MainService.indexAll();
  }
}
