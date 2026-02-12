import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { CreatePostBodyDto, UpdatePostDto } from './posts.dto.js'
import { PrismaService } from '../../shared/services/prisma.service.js'
import { Post, Prisma } from '../../../generated/prisma/client.js'

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}
  getPosts() {
    return this.prisma.post.findMany()
  }

  async getPost(postWhereUniqueInput: Prisma.PostWhereUniqueInput): Promise<Post | null> {
    const post = await this.prisma.post.findUnique({
      where: postWhereUniqueInput,
    })

    if (!post) {
      throw new NotFoundException('Post not found')
    }

    return post
  }

  createPost(post: CreatePostBodyDto, authorId: number) {
    return this.prisma.post.create({
      data: {
        title: post.title,
        content: post.content,
        authorId,
      },
    })
  }

  async updatePost(id: string, post: UpdatePostDto, userId: number) {
    const existingPost = await this.prisma.post.findUnique({
      where: { id: Number(id) },
    })

    if (!existingPost) {
      throw new NotFoundException('Post not found')
    }

    if (existingPost.authorId !== userId) {
      throw new ForbiddenException('You can only update your own posts')
    }

    return this.prisma.post.update({
      where: { id: Number(id) },
      data: post,
    })
  }

  async deletePost(id: string, userId: number) {
    const existingPost = await this.prisma.post.findUnique({
      where: { id: Number(id) },
    })

    if (!existingPost) {
      throw new NotFoundException('Post not found')
    }

    if (existingPost.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own posts')
    }

    await this.prisma.post.delete({
      where: { id: Number(id) },
    })

    return { message: 'Post deleted successfully' }
  }
}
