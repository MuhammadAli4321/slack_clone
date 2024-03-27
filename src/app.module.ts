// app.module.ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { MessageModule } from './message/ message.module';
import { UserMiddleware } from './middlewares/ user.middleware';

@Module({
  imports: [
    JwtModule.register({ secret: 'your_secret_key' }),
    DatabaseModule,
    AuthModule,
    MessageModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserMiddleware)
      .forRoutes('auth/users', 'auth/details', 'messages/*');
  }
}
