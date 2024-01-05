import { Injectable } from '@nestjs/common';
import config from 'src/Service/config';
import type { NyaUserInfo } from './oauth.interface';
import axios from 'axios';

@Injectable()
export class OauthService {
  async nya(session: Record<string, any>, code: string) {
    try {
      const { data: 令牌 } = await axios.post(
        'https://api.imlazy.ink/v1/oauth2/token',
        {
          client_id: config.oauth2_config.client_id,
          client_secret: config.oauth2_config.client_secret,
          redirect_uri: config.oauth2_config.redirect_uri,
          grant_type: 'authorization_code',
          code: code,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
      if (!令牌.access_token) {
        throw new Error(令牌);
      }

      const { data: resData } = await axios.get(
        'https://api.imlazy.ink/v1/oauth2/user',
        {
          headers: {
            // 'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${令牌.access_token}`,
          },
        },
      );
      const userInfo: NyaUserInfo = resData.data;
      session['login'] = true;
      session['uuid'] = userInfo.uuid;
      // 偷懒了，用户不存数据库了，直接拿现成的
      session['role'] = userInfo.role;
      return {
        code: 200,
        msg: '登录成功',
        data: userInfo,
      };
    } catch (err) {
      throw new Error(err.response.data.msg || err.message);
    }
  }
}
