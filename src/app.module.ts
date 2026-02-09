import { ClassSerializerInterceptor, Module } from '@nestjs/common'
import { AppController } from './app.controller.js'
import { AppService } from './app.service.js'
import { PostsModule } from './modules/posts/posts.module.js'
import { SharedModule } from './shared/shared.module.js'
import { AuthModule } from './modules/auth/auth.module.js'
import { APP_INTERCEPTOR } from '@nestjs/core'

@Module({
  imports: [SharedModule, PostsModule, AuthModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
