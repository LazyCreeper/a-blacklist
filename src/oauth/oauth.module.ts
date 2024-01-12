import { Module } from '@nestjs/common';
import { OauthController } from './oauth.controller';
import { OauthService } from './oauth.service';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [OauthController],
  providers: [OauthService, UserService],
})
export class OauthModule {}
