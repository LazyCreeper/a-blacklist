import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { db } from 'src/Service/mysql';
import { SortByList, type Blacklist } from './main.interface';

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
        time: new Date().getTime(),
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
      status: true,
      code: 200,
      msg: '获取成功',
      time: new Date().getTime(),
      data: {
        totalCount: Number(totalCount[0].count),
        totalPages: totalPages,
        peoples: r,
      },
    };
  }

  indexPost() {
    return {
      code: 500,
      msg: '嗯哼？',
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
