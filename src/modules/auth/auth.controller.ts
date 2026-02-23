import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { AuthService } from './auth.service.js'
import { LoginDto, RefreshTokenDto, RegisterDto } from './auth.dto.js'
import { AuthGuard } from '../../common/decorators/auth.decorator.js'
import { AuthKind } from '../../constants/auth.constant.js'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto)
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto)
  }

  @Post('refresh-token')
  @AuthGuard([AuthKind.Bearer])
  refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto.refreshToken)
  }
}
