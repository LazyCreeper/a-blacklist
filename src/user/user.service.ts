import { Injectable } from '@nestjs/common';
import { db } from 'src/Service/mysql';
import type { UserInfo } from './user.interface';

@Injectable()
export class UserService {
  // 获取当前用户信息
  async info(session: Record<string, any>) {
    return {
      status: true,
      code: 200,
      msg: '获取成功',
      time: Date.now(),
      data: (await this.info_(session.email)).data,
    };
  }

  /**
   * 管理员接口
   */
  // 根据 Email 获取用户信息
  async info_(email: string) {
    const [r]: UserInfo[] = await db.query(
      'select * from users where email=?',
      `${email}`,
    );
    return {
      code: 200,
      msg: '获取成功',
      time: Date.now(),
      data: r,
    };
  }

  // 用户列表
  async list(
    page: number,
    pageSize: number,
    sortBy: string,
    sortDesc: string,
    search: string,
  ) {
    const totalCount = await db.query('SELECT COUNT(*) as count from users');
    if (pageSize == -1) {
      const r = await db.query('select * from users');
      return {
        status: true,
        code: 200,
        msg: '获取成功',
        time: Date.now(),
        data: {
          totalCount: Number(totalCount[0].count),
          totalPages: 1,
          users: r,
        },
      };
    }
    const offset = (page - 1) * pageSize;
    const totalPages = Math.ceil(Number(totalCount[0].count) / pageSize);

    // 排序方式
    const sortOrder = sortDesc === 'true' ? 'DESC' : 'ASC';

    // 根据什么排序
    sortBy = sortBy ? sortBy : 'id';

    // 查询语句
    let query = `SELECT * from users`;

    // 构建搜索条件
    if (search) {
      query += ` WHERE id LIKE ? OR name LIKE ? OR email LIKE ? OR role LIKE ? OR status LIKE ? OR regTime LIKE ?`;
    }

    // 构建排序条件
    query += ` ORDER BY ${sortBy} ${sortOrder}`;

    // 添加翻页限制
    query += ` LIMIT ${pageSize} OFFSET ${offset}`;

    const values = search
      ? [
          `%${search}%`,
          `%${search}%`,
          `%${search}%`,
          `%${search}%`,
          `%${search}%`,
          `%${search}%`,
        ]
      : [];
    const r = await db.query(query, values);

    return {
      code: 200,
      msg: '获取成功',
      time: Date.now(),
      data: {
        totalCount: Number(totalCount[0].count),
        totalPages: totalPages,
        users: r,
      },
    };
  }

  // 更新指定用户信息
  async update_(body: UserInfo) {
    // 更新用户数据
    const r = await db.query(`update users set role=?, status=? where id=?`, [
      body.role,
      body.status,
      body.id,
    ]);
    if (r.affectedRows !== 1) throw new Error('恭喜，你数据库没了');
    return {
      status: true,
      code: 200,
      msg: '更新成功',
      time: Date.now(),
    };
  }

  // 删除用户
  async delete(body: UserInfo) {
    const r = await db.query('delete from users where id=?', body.id);
    if (r.affectedRows !== 1)
      throw new Error('发生了未知错误，请联系网站管理员');
    return {
      code: 200,
      msg: '删除成功',
      time: Date.now(),
    };
  }
}
