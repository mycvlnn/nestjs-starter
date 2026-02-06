import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller.js'
import { AppService } from './app.service.js'
import { PostsModule } from './modules/posts/posts.module.js'
import { SharedModule } from './shared/shared.module.js'
import { validate } from './config/env.validation.js'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    PostsModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
