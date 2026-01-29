import { Injectable } from '@nestjs/common'

@Injectable()
export class PostsService {
  getPosts(): string {
    return 'This action returns all posts'
  }

  getPost(id: string): string {
    return `This action returns post with id: ${id}`
  }

  createPost(post: { title: string; content: string }) {
    return post
  }

  updatePost(id: string, post: { title: string; content: string }) {
    return { id, ...post }
  }

  deletePost(id: string) {
    return `This action deletes post with id: ${id}`
  }
}
