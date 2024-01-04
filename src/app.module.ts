import { Module, MiddlewareConsumer } from '@nestjs/common';

import { dbConnect } from './Middleware/protocol';
import { MainModule } from './main/main.module';

@Module({
  imports: [MainModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(dbConnect).forRoutes('');
  }
}
