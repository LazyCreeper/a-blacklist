import { Controller, HttpCode, Session, Body, Post, Get } from '@nestjs/common';
import { OauthService as OauthServices } from './oauth.service';

@Controller('oauth2')
export class OauthController {
  constructor(private readonly OauthService: OauthServices) {}

  @Post('nyancy')
  @HttpCode(200)
  async nyancy(
    @Body()
    body: {
      code: string;
    },
  ) {
    return this.OauthService.nya(body);
  }

  @Get('nyancy')
  @HttpCode(200)
  async returnNyancyUrl() {
    return this.OauthService.returnNyancyUrl();
  }

  @Post('nyancy/user')
  @HttpCode(200)
  async info(
    @Session() session: Record<string, any>,
    @Body()
    body: {
      access_token: string;
    },
  ) {
    return this.OauthService.user(session, body);
  }
}
