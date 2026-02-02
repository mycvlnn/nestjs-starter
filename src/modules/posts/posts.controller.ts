import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { PostsService } from './posts.service.js'
import { CreatePostDto, UpdatePostDto } from './posts.dto.js'
import { PostModel } from 'generated/prisma/models.js'

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
  createPost(@Body() dto: CreatePostDto) {
    return this.postsService.createPost(dto)
  }

  @Put(':id')
  updatePost(@Param('id') id: string, @Body() body: UpdatePostDto) {
    return this.postsService.updatePost(id, body)
  }

  @Delete(':id')
  deletePost(@Param('id') id: string) {
    return this.postsService.deletePost(id)
  }
}
