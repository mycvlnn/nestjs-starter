import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Request } from 'express'
import { TokenService } from '../services/token.service.js'
import { USER_REQUEST_KEY } from '../../constants/auth.constant.js'
import { isJwtError } from '../../common/guards/error.guard.js'

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private tokenService: TokenService) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>()
    const token = this.extractTokenFromHeader(request)
    if (!token) {
      throw new UnauthorizedException('Access token is required')
    }
    try {
      const payload = this.tokenService.verifyAcessToken(token)
      request[USER_REQUEST_KEY] = payload
    } catch (error) {
      if (isJwtError(error)) {
        throw new UnauthorizedException(error.message)
      }
      throw error
    }
    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
