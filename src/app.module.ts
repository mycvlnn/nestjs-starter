import { Module } from '@nestjs/common'
import { AppController } from './app.controller.js'
import { AppService } from './app.service.js'
import { PostsModule } from './modules/posts/posts.module.js'
import { SharedModule } from './shared/shared.module.js'
import { AuthModule } from './modules/auth/auth.module.js'

@Module({
  imports: [SharedModule, PostsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
