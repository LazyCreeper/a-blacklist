import { Controller, HttpCode, Session, Query, Get } from '@nestjs/common';
import { OauthService as OauthServices } from './oauth.service';

@Controller('oauth2')
export class OauthController {
  constructor(private readonly OauthService: OauthServices) {}

  @Get('nyancy')
  @HttpCode(200)
  async nyancy(
    @Session() session: Record<string, any>,
    @Query('code') code: string,
  ) {
    return this.OauthService.nya(session, code);
  }
}
