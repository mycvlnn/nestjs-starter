import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Request } from 'express'
import { TokenService } from '../services/token.service.js'
import { USER_KEY } from '../../constants/index.js'
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC_KEY } from '../../common/decorators/auth.decorator.js'

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext) {
    // Tìm kiếm metadata để kiểm tra xem route có được đánh dấu là public hay không
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    // Nếu là route public, cho phép truy cập mà không cần kiểm tra token
    if (isPublic) {
      return true
    }

    const request = context.switchToHttp().getRequest<Request>()
    const token = this.extractTokenFromHeader(request)
    if (!token) {
      throw new UnauthorizedException('Access token is required')
    }
    try {
      const payload = this.tokenService.verifyAcessToken(token)
      request[USER_KEY] = payload
    } catch (error) {
      throw new UnauthorizedException(error)
    }
    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
