import { Module } from '@nestjs/common'
import { AppController } from './app.controller.js'
import { AppService } from './app.service.js'
import { PostsModule } from './posts/posts.module.js'
import { PrismaService } from './prisma.service.js'

@Module({
  imports: [PostsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
