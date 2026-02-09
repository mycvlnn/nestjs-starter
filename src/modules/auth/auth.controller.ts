import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service.js'
import { RegisterDto } from './auth.dto.js'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const data = await this.authService.register(dto)

    return {
      message: 'User registered successfully',
      data,
    }
  }
}
