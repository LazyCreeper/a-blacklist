import { Injectable } from '@nestjs/common';
import config from 'src/Service/config';
import type { NyaUserInfo } from './oauth.interface';
import axios from 'axios';
import { isSafeData } from 'src/Utils';
import { db } from 'src/Service/mysql';
import { UserService as UserServices } from 'src/user/user.service';

@Injectable()
export class OauthService {
  constructor(private readonly UserService: UserServices) {}

  async nya(body: { code: string }) {
    await isSafeData(body);
    try {
      const { data: 令牌 } = await axios.post(
        'https://account.lazy.ink/v1/oauth2/token',
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
        time: Date.now(),
      };
    } catch (err) {
      throw new Error(err.response.data.msg || err.message);
    }
  }

  async user(session: Record<string, any>, body: { access_token: string }) {
    await isSafeData(body);
    try {
      const { data: resData } = await axios.get(
        'https://account.lazy.ink/v1/oauth2/user',
        {
          headers: {
            // 'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${body.access_token}`,
          },
        },
      );
      const userInfo: NyaUserInfo = resData.data;

      // 判断该用户是否已注册
      const u = await this.UserService.info_(userInfo.email);
      if (u.data) {
        if (u.data.status == -1) throw new Error('你已被封禁，无法登录！');
        session['login'] = true;
        session['role'] = u.data.role;
        return {
          code: 200,
          msg: '登录成功',
          data: u.data,
          time: Date.now(),
        };
      } else {
        // 写入用户信息到数据库
        await db.query(
          'insert into users (name,email,role,status,regTime) values (?,?,?,?,?)',
          [
            userInfo.username,
            userInfo.email,
            userInfo.role,
            userInfo.status,
            new Date(),
          ],
        );
        session['login'] = true;
        session['role'] = userInfo.role;
        return {
          code: 200,
          msg: '登录成功',
          // 这里返回的是 OAuth2 平台的用户信息，懒得做处理了
          data: userInfo,
          time: Date.now(),
        };
      }
    } catch (err) {
      // console.error(err);
      throw new Error(err.response?.data.msg || err.message);
    }
  }

  returnNyancyUrl() {
    const url = `https://account.lazy.ink/oauth2/authorize?client_id=${
      config.oauth2_config.client_id
    }&response_type=code&state=${String(
      Math.random(),
    )}&redirect_uri=${encodeURIComponent(config.oauth2_config.redirect_uri)}`;

    return {
      code: 200,
      msg: '获取成功',
      data: {
        url,
      },
    };
  }
}
