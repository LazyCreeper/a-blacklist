import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { db } from 'src/Service/mysql';
import { SortByList, type Blacklist } from './main.interface';
import { isSafeData } from 'src/Utils';

@Injectable()
export class MainService {
  async list(
    page: number,
    pageSize: number,
    sortBy: string,
    sortDesc: string,
    search: string,
  ) {
    if (!page || !pageSize)
      throw new HttpException(
        {
          msg: '参数有误',
        },
        HttpStatus.EXPECTATION_FAILED,
      );

    // 可能是bigint
    const totalCount: { count: number }[] = await db.query(
      `SELECT COUNT(*) as count FROM list`,
    );

    // -1 返回所有结果
    if (pageSize == -1) {
      const r: Blacklist[] = await db.query(`select * from list`);
      return {
        code: 200,
        msg: '获取成功',
        time: Date.now(),
        data: {
          totalCount: Number(totalCount[0].count),
          totalPages: 1,
          peoples: r,
        },
      };
    }

    if (Math.round(page) - 1 < 0) {
      throw new Error('Error Page');
    }
    pageSize = Math.round(pageSize);
    if (pageSize < 1) {
      throw new Error('Error PageSize');
    }
    const offset = (Math.round(page) - 1) * pageSize;
    const totalPages = Math.ceil(Number(totalCount[0].count) / pageSize);

    // 排序方式
    const sortOrder = sortDesc === 'true' ? 'DESC' : 'ASC';

    // 根据什么排序
    if (!SortByList.includes(sortBy)) throw new Error('Error SortBy');
    sortBy = sortBy ? sortBy : 'id';

    // 查询语句
    let query = `SELECT * FROM list`;

    // 构建搜索条件
    // 注意：如果使用搜索，那么后端返回的totalCount则还是总数，并不是查询到的总数，请前端自行统计！
    if (search) {
      query += ` WHERE id LIKE ? OR qq LIKE ? OR bilibili LIKE ? OR reason LIKE ?`;
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
        ]
      : [];
    const r: Blacklist[] = await db.query(query, values);

    return {
      code: 200,
      msg: '获取成功',
      time: Date.now(),
      data: {
        totalCount: Number(totalCount[0].count),
        totalPages: totalPages,
        peoples: r,
      },
    };
  }

  async add(body: Blacklist) {
    await isSafeData(body);
    const i = await db.query(
      `insert into list (qq,bilibili,reason,violateTime,updateAt) values (?,?,?,?,?)`,
      [body.qq, body.bilibili, body.reason, body.violateTime, new Date()],
    );

    if (i.affectedRows === 1) {
      return {
        code: 200,
        msg: '添加成功',
        time: Date.now(),
      };
    } else {
      throw new Error('添加失败，可能数据库炸了');
    }
  }

  async update(body: Blacklist) {
    await isSafeData(body);
    const r = await db.query(
      `update list set qq=?, bilibili=?, reason=?, violateTime=?, updateAt=? where id=?`,
      [
        body.qq,
        body.bilibili,
        body.reason,
        body.violateTime,
        new Date(),
        body.id,
      ],
    );
    if (r.affectedRows !== 1) throw new Error('恭喜，你数据库没了');

    return {
      code: 200,
      msg: '更新成功',
      time: Date.now(),
    };
  }

  async delete(body: Blacklist) {
    if (!body.id) throw new Error('缺少必要参数');
    await isSafeData(body);
    const d = await db.query(`delete from list where id="${body.id}"`);
    if (d.affectedRows !== 1) throw new Error('恭喜，你数据库没了');

    return {
      code: 200,
      msg: '删除成功',
      time: Date.now(),
    };
  }

  indexAll() {
    throw new HttpException(
      {
        msg: 'fuck',
      },
      HttpStatus.METHOD_NOT_ALLOWED,
    );
  }
}
