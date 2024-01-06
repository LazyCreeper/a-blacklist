import { Injectable } from '@nestjs/common';
import config from 'src/Service/config';
import type { NyaUserInfo } from './oauth.interface';
import axios from 'axios';
import { isSafeData } from 'src/Utils';

@Injectable()
export class OauthService {
  async nya(body: { code: string }) {
    await isSafeData(body);
    try {
      const { data: 令牌 } = await axios.post(
        'https://api.imlazy.ink/v1/oauth2/token',
        {
          client_id: config.oauth2_config.client_id,
          client_secret: config.oauth2_config.client_secret,
          redirect_uri: config.oauth2_config.redirect_uri,
          grant_type: 'authorization_code',
          code: body.code,
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
      return {
        code: 200,
        msg: '获取成功',
        data: {
          token: 令牌.access_token,
        },
        time: new Date().getTime(),
      };
    } catch (err) {
      throw new Error(err.response.data.msg || err.message);
    }
  }

  async user(session: Record<string, any>, body: { access_token: string }) {
    await isSafeData(body);
    try {
      const { data: resData } = await axios.get(
        'https://api.imlazy.ink/v1/oauth2/user',
        {
          headers: {
            // 'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${body.access_token}`,
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
        time: new Date().getTime(),
      };
    } catch (err) {
      throw new Error(err.response.data.msg || err.message);
    }
  }

  returnNyancyUrl() {
    const url = `https://api.imlazy.ink/#/oauth2/authorize?client_id=${
      config.oauth2_config.client_id
    }&response_type=code&redirect_uri=${encodeURIComponent(
      config.oauth2_config.redirect_uri,
    )}`;

    return {
      code: 200,
      msg: '获取成功',
      data: {
        url,
      },
    };
  }
}
