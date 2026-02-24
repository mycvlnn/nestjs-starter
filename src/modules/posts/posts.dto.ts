import { IsOptional, IsString, Length } from 'class-validator'
import { PostModel } from '../../shared/models/post.model.js'
import { Type } from 'class-transformer'
import { UserModel } from '../../shared/models/user.model.js'

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

export class PostItemDto extends PostModel {
  @Type(() => UserModel)
  author: Omit<UserModel, 'password'> // Loại bỏ trường password khi trả về thông tin tác giả

  constructor(partial: Partial<PostItemDto>) {
    super(partial)
    Object.assign(this, partial)
  }
}
