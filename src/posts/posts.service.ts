import { Injectable } from '@nestjs/common'
import { CreatePostDto, UpdatePostDto } from './posts.dto'

@Injectable()
export class PostsService {
  getPosts(): string {
    return 'This action returns all posts'
  }

  getPost(id: string): string {
    return `This action returns post with id: ${id}`
  }

  createPost(post: CreatePostDto) {
    return post
  }

  updatePost(id: string, post: UpdatePostDto) {
    return { id, ...post }
  }

  deletePost(id: string) {
    return `This action deletes post with id: ${id}`
  }
}
