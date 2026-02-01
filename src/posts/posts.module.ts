import { Module } from '@nestjs/common'
import { PostsController } from './posts.controller.js'
import { PostsService } from './posts.service.js'
import { PrismaService } from '../prisma.service.js'

@Module({
  controllers: [PostsController],
  providers: [PostsService, PrismaService],
})
export class PostsModule {}
