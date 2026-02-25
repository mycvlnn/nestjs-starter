import { Injectable, NotFoundException } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'

import { CreatePostBodyDto, PostDetailResDto, UpdatePostDto } from './posts.dto.js'
import { PrismaService } from '../../shared/services/prisma.service.js'
import { Post, Prisma } from '../../../generated/prisma/client.js'
import { isPrismaNotFoundError } from '../../common/guards/error.guard.js'

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}
  async getPosts() {
    const result = await this.prisma.post.findMany({
      include: {
        author: true,
      },
    })

    return plainToInstance(PostDetailResDto, result)
  }

  async getPost(postWhereUniqueInput: Prisma.PostWhereUniqueInput): Promise<Post | null> {
    try {
      const post = await this.prisma.post.findUniqueOrThrow({
        where: postWhereUniqueInput,
        include: {
          author: true,
        },
      })

      return new PostDetailResDto(post)
    } catch (error) {
      if (isPrismaNotFoundError(error)) {
        throw new NotFoundException('Post not found')
      }

      throw error
    }
  }

  async createPost(post: CreatePostBodyDto, authorId: number) {
    const result = await this.prisma.post.create({
      data: {
        title: post.title,
        content: post.content,
        authorId,
      },
      include: {
        author: true,
      },
    })

    return new PostDetailResDto(result)
  }

  async updatePost({
    postId,
    post,
    userId,
  }: {
    postId: string
    post: UpdatePostDto
    userId: number
  }) {
    try {
      const result = await this.prisma.post.update({
        where: { id: Number(postId), authorId: userId },
        data: post,
        include: {
          author: true,
        },
      })

      return new PostDetailResDto(result)
    } catch (error) {
      if (isPrismaNotFoundError(error)) {
        throw new NotFoundException('Post not found')
      }

      throw error
    }
  }

  async deletePost(id: string, userId: number) {
    try {
      await this.prisma.post.delete({
        where: { id: Number(id), authorId: userId },
      })

      return { message: 'Post deleted successfully' }
    } catch (error) {
      if (isPrismaNotFoundError(error)) {
        throw new NotFoundException('Post not found')
      }

      throw error
    }
  }
}
