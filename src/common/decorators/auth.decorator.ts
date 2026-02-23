import { SetMetadata } from '@nestjs/common'
import { AuthType, ConditionGuard, ConditionGuardType } from '../../constants/auth.constant.js'

export const IS_PUBLIC_KEY = 'isPublic'
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)

export const AUTH_TYPE_KEY = 'authType'

export const AuthGuard = (authTypes: AuthType[], options?: { condition: ConditionGuardType }) =>
  SetMetadata(AUTH_TYPE_KEY, { authTypes, condition: options?.condition || ConditionGuard.Or })
