import { IsEmail, IsString, MinLength } from 'class-validator'
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
