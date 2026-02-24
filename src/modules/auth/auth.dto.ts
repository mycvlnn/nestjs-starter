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
  @Match('password')
  confirmPassword: string

  @IsString()
  @MinLength(2)
  name: string
}

export class UserResDto {
  id: number
  email: string
  name: string
  @Exclude()
  password: string
  createdAt: Date
  updatedAt: Date

  constructor(partial: Partial<UserResDto>) {
    Object.assign(this, partial)
  }
}

export class RefreshTokenDto {
  @IsString()
  refreshToken: string
}

export class LogoutDto extends RefreshTokenDto {}
