import { IsEmail, IsString, MinLength } from 'class-validator'
import { Exclude } from 'class-transformer'
import { Match } from '../../common/decorators/match.decorator.js'

export class LoginDto {
  @IsEmail()
  email: string

  @IsString()
  password: string
}

export class RegisterDto extends LoginDto {
  @IsString()
  @Match('password', { message: 'Password confirmation does not match password' })
  confirmPassword: string

  @IsString()
  @MinLength(2)
  name: string
}

export class UserDto {
  id: number
  email: string
  name: string
  @Exclude()
  password: string
  createdAt: Date
  updatedAt: Date

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial)
  }
}
