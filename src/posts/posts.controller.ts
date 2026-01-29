import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getPosts(): string {
    return this.postsService.getPosts();
  }

  @Get(':id')
  getPost(@Param('id') id: string): string {
    return this.postsService.getPost(id);
  }

  @Post()
  createPost(@Body() body: { title: string; content: string }) {
    return this.postsService.createPost({
      title: body.title,
      content: body.content,
    });
  }

  @Put(':id')
  updatePost(
    @Param('id') id: string,
    @Body() body: { title: string; content: string },
  ) {
    return this.postsService.updatePost(id, {
      title: body.title,
      content: body.content,
    });
  }

  @Delete(':id')
  deletePost(@Param('id') id: string) {
    return this.postsService.deletePost(id);
  }
}
