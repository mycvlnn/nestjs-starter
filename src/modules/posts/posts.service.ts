import { Injectable } from '@nestjs/common'
import { CreatePostDto, UpdatePostDto } from './posts.dto.js'
import { PrismaService } from '../../shared/services/prisma.service.js'
import { Post, Prisma } from '../../../generated/prisma/client.js'

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}
  getPosts() {
    return this.prisma.post.findMany()
  }

  getPost(postWhereUniqueInput: Prisma.PostWhereUniqueInput): Promise<Post | null> {
    return this.prisma.post.findUnique({
      where: postWhereUniqueInput,
    })
  }

  createPost(post: CreatePostDto) {
    return this.prisma.post.create({
      data: {
        title: post.title,
        content: post.content,
        authorId: 1,
      },
    })
  }

  updatePost(id: string, post: UpdatePostDto) {
    return { id, ...post }
  }

  deletePost(id: string) {
    return `This action deletes post with id: ${id}`
  }
}
