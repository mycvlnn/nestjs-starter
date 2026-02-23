/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { Request } from 'express'
import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common'
import { PostsService } from './posts.service.js'
import { CreatePostBodyDto, UpdatePostDto } from './posts.dto.js'
import { PostModel } from 'generated/prisma/models.js'
import { AuthGuard } from '../../common/decorators/auth.decorator.js'
import { AuthKind, USER_REQUEST_KEY } from './../../constants/auth.constant.js'

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getPosts() {
    return this.postsService.getPosts()
  }

  @Get(':id')
  getPost(@Param('id') id: string): Promise<PostModel | null> {
    return this.postsService.getPost({
      id: Number(id),
    })
  }

  @Post()
  @AuthGuard([AuthKind.Bearer])
  createPost(@Body() dto: CreatePostBodyDto, @Req() req: Request) {
    const userId = req?.[USER_REQUEST_KEY]?.userId as number

    return this.postsService.createPost(dto, userId)
  }

  @Put(':id')
  @AuthGuard([AuthKind.Bearer])
  updatePost(@Param('id') id: string, @Body() body: UpdatePostDto, @Req() req: Request) {
    const userId = req?.[USER_REQUEST_KEY]?.userId as number

    return this.postsService.updatePost(id, body, userId)
  }

  @Delete(':id')
  @AuthGuard([AuthKind.Bearer])
  deletePost(@Param('id') id: string, @Req() req: Request) {
    const userId = req?.[USER_REQUEST_KEY]?.userId as number

    return this.postsService.deletePost(id, userId)
  }
}
