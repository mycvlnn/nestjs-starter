import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Request } from 'express'
import { envConfig } from '../../config/env.validation.js'

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>()
    const xApiKey = request.headers['x-api-key'] as string

    if (xApiKey !== envConfig.API_KEY_SECRET) {
      throw new UnauthorizedException('Invalid API key')
    }

    return true
  }
}
