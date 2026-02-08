import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service.js'
import { RegisterDto } from './auth.dto.js'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto)
  }
}
