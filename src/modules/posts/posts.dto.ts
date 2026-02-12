import { IsOptional, IsString, Length } from 'class-validator'

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
