import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AUTH_TYPE_KEY } from '../../common/decorators/auth.decorator.js'
import { AuthGuardPayloadType, AuthKind, ConditionGuard } from '../../constants/auth.constant.js'
import { AccessTokenGuard } from './access-token.guard.js'
import { ApiKeyGuard } from './api-key.guard.js'

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private readonly authTypeGuardMap: Record<string, CanActivate>

  constructor(
    private reflector: Reflector,
    private accessTokenGuard: AccessTokenGuard,
    private apiKeyGuard: ApiKeyGuard,
  ) {
    this.authTypeGuardMap = {
      [AuthKind.Bearer]: this.accessTokenGuard,
      [AuthKind.APIKey]: this.apiKeyGuard,
    }
  }

  async canActivate(context: ExecutionContext) {
    const authGuardValue = this.reflector.getAllAndOverride<AuthGuardPayloadType | undefined>(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    )

    // Nếu không có metadata nào được chỉ định, cho phép truy cập
    if (!authGuardValue) return true

    const guards = authGuardValue.authTypes
      .map((type: string) => this.authTypeGuardMap[type])
      .filter(Boolean)

    // Nếu không có guard nào được chỉ định, cho phép truy cập
    if (!guards.length) return true

    return authGuardValue.condition === ConditionGuard.And
      ? this.evaluateAndCondition(guards, context)
      : this.evaluateOrCondition(guards, context)
  }

  private async evaluateAndCondition(
    guards: CanActivate[],
    context: ExecutionContext,
  ): Promise<boolean> {
    for (const guard of guards) {
      await guard.canActivate(context)
    }

    return true
  }

  private async evaluateOrCondition(
    guards: CanActivate[],
    context: ExecutionContext,
  ): Promise<boolean> {
    let error = new UnauthorizedException('Authentication failed')

    for (const guard of guards) {
      try {
        const canActivate = await guard.canActivate(context)
        if (canActivate) return true
      } catch (err) {
        if (err instanceof UnauthorizedException) {
          error = err
        }
      }
    }

    throw error
  }
}
