/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common'
import { PostsService } from './posts.service.js'
import { CreatePostBodyDto, UpdatePostDto } from './posts.dto.js'
import { PostModel } from 'generated/prisma/models.js'
import { Public } from '../../common/decorators/auth.decorator.js'
import type { Request } from 'express'
import { USER_KEY } from '../../constants/common.js'

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @Public()
  getPosts() {
    return this.postsService.getPosts()
  }

  @Get(':id')
  @Public()
  getPost(@Param('id') id: string): Promise<PostModel | null> {
    return this.postsService.getPost({
      id: Number(id),
    })
  }

  @Post()
  createPost(@Body() dto: CreatePostBodyDto, @Req() req: Request) {
    const userId = req?.[USER_KEY]?.userId as number

    return this.postsService.createPost(dto, userId)
  }

  @Put(':id')
  updatePost(@Param('id') id: string, @Body() body: UpdatePostDto, @Req() req: Request) {
    const userId = req?.[USER_KEY]?.userId as number

    return this.postsService.updatePost(id, body, userId)
  }

  @Delete(':id')
  deletePost(@Param('id') id: string, @Req() req: Request) {
    const userId = req?.[USER_KEY]?.userId as number

    return this.postsService.deletePost(id, userId)
  }
}
