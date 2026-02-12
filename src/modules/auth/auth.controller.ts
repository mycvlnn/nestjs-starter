import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service.js'
import { LoginDto, RefreshTokenDto, RegisterDto } from './auth.dto.js'
import { AccessTokenGuard } from '../../shared/guards/access-token.guard.js'
import { ApiKeyGuard } from '../../shared/guards/api-key.guard.js'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto)
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto)
  }

  @UseGuards(AccessTokenGuard)
  @UseGuards(ApiKeyGuard)
  @Post('refresh-token')
  refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto.refreshToken)
  }
}
