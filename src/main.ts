import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { logger } from './Utils/log';
import config from './Service/config';

import { GlobalHeaders } from './Middleware/protocol';
import { GlobalExceptionFilter } from './Middleware/exceptionFilter ';

import session from 'express-session';

async function bootstrap() {
  logger.info(`

 █████╗     ██████╗ ██╗      █████╗  ██████╗██╗  ██╗██╗     ██╗███████╗████████╗
██╔══██╗    ██╔══██╗██║     ██╔══██╗██╔════╝██║ ██╔╝██║     ██║██╔════╝╚══██╔══╝
███████║    ██████╔╝██║     ███████║██║     █████╔╝ ██║     ██║███████╗   ██║   
██╔══██║    ██╔══██╗██║     ██╔══██║██║     ██╔═██╗ ██║     ██║╚════██║   ██║   
██║  ██║    ██████╔╝███████╗██║  ██║╚██████╗██║  ██╗███████╗██║███████║   ██║   
╚═╝  ╚═╝    ╚═════╝ ╚══════╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝╚══════╝   ╚═╝   
                                                                                
  + Copyright (C) ${new Date().getFullYear()} Lazy All right reserved
  `);
  const app = await NestFactory.create(AppModule);
  app.use(GlobalHeaders);
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      cookie: {
        maxAge: 60 * 1000 * 60 * 240,
        // maxAge: 10,
      },
      saveUninitialized: true,
    }),
  );
  await app.listen(config.http_port);
  logger.info(`程序已启动：${await app.getUrl()}`);
}
bootstrap();
