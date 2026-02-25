import { IsOptional, IsString, Length } from 'class-validator'
import { Type } from 'class-transformer'
import { UserResDto } from '../auth/auth.dto.js'

export class CreatePostBodyDto {
  @IsString()
  @Length(5, 100)
  title: string

  @IsString()
  @Length(10, 5000)
  content: string
}

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  @Length(5, 100)
  title: string

  @IsOptional()
  @IsString()
  @Length(10, 5000)
  content: string
}

export class PostDetailResDto {
  id: number
  title: string
  content: string
  authorId: number
  createdAt: Date
  updatedAt: Date

  @Type(() => UserResDto)
  author: UserResDto

  constructor(partial: Partial<PostDetailResDto>) {
    Object.assign(this, partial)
  }
}
