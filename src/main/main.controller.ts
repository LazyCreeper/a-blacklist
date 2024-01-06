import {
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  Query,
  All,
  Body,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { MainService as MainServices } from './main.service';
import { isAdmin } from 'src/Guard/permission';
import { Blacklist } from './main.interface';

@Controller()
export class MainController {
  constructor(private readonly MainService: MainServices) {}

  @Get()
  @HttpCode(200)
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
  add(@Body() body: Blacklist) {
    return this.MainService.add(body);
  }

  @Put()
  @HttpCode(200)
  @UseGuards(isAdmin)
  update(@Body() body: Blacklist) {
    return this.MainService.update(body);
  }

  @Delete()
  @HttpCode(200)
  @UseGuards(isAdmin)
  delete(@Body() body: Blacklist) {
    return this.MainService.delete(body);
  }

  @All()
  @HttpCode(666)
  all() {
    return this.MainService.indexAll();
  }
}
