import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { USER_REQUEST_KEY } from '../../constants/auth.constant.js'
import { Request } from 'express'
import { TokenDecodedPayload } from '../../types/jwt.type.js'

export const User = createParamDecorator(
  (field: keyof TokenDecodedPayload | undefined, ctx: ExecutionContext): any => {
    const request = ctx.switchToHttp().getRequest<Request>()
    const user = request[USER_REQUEST_KEY] as TokenDecodedPayload

    return field ? (user as Record<string, any>)?.[field] : user
  },
)
