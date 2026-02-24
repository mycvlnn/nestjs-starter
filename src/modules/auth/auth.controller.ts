/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common'
import { AuthService } from './auth.service.js'
import { LoginDto, LogoutDto, RefreshTokenDto, RegisterDto } from './auth.dto.js'
import { AuthGuard } from '../../common/decorators/auth.decorator.js'
import { AuthKind, USER_REQUEST_KEY } from '../../constants/auth.constant.js'
import type { Request } from 'express'

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

  @Post('logout')
  @AuthGuard([AuthKind.Bearer])
  logout(@Body() dto: LogoutDto, @Req() req: Request) {
    const userId = req?.[USER_REQUEST_KEY]?.userId as number
    return this.authService.logout(dto.refreshToken, userId)
  }
}
