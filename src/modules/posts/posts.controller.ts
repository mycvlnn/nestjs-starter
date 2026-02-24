import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { PostsService } from './posts.service.js'
import { CreatePostBodyDto, PostItemDto, UpdatePostDto } from './posts.dto.js'
import { PostModel } from 'generated/prisma/models.js'
import { AuthGuard } from '../../common/decorators/auth.decorator.js'
import { User } from '../../common/decorators/user.decorator.js'
import { AuthKind } from './../../constants/auth.constant.js'
import { plainToInstance } from 'class-transformer'

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @AuthGuard([AuthKind.Bearer])
  async getPosts(@User('userId') userId: number) {
    const result = await this.postsService.getPosts(userId)

    return plainToInstance(PostItemDto, result)
  }

  @Get(':id')
  getPost(@Param('id') id: string): Promise<PostModel | null> {
    return this.postsService.getPost({
      id: Number(id),
    })
  }

  @Post()
  @AuthGuard([AuthKind.Bearer])
  createPost(@Body() dto: CreatePostBodyDto, @User('userId') userId: number) {
    return this.postsService.createPost(dto, userId)
  }

  @Put(':id')
  @AuthGuard([AuthKind.Bearer])
  updatePost(@Param('id') id: string, @Body() body: UpdatePostDto, @User('userId') userId: number) {
    return this.postsService.updatePost(id, body, userId)
  }

  @Delete(':id')
  @AuthGuard([AuthKind.Bearer])
  deletePost(@Param('id') id: string, @User('userId') userId: number) {
    return this.postsService.deletePost(id, userId)
  }
}
