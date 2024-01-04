import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

const data = {
  appName: 'A Blacklist',
  author: 'Lazy',
  version: '1.0.0',
};

@Injectable()
export class MainService {
  indexGet() {
    return {
      code: 233,
      msg: '哇哦？',
      data,
    };
  }
  indexPost() {
    return {
      code: 500,
      msg: '嗯哼？',
      data,
    };
  }
  indexAll() {
    throw new HttpException(
      {
        code: HttpStatus.METHOD_NOT_ALLOWED,
        msg: 'fuck',
      },
      HttpStatus.METHOD_NOT_ALLOWED,
    );
  }
}
