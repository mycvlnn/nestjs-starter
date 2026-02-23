export const USER_REQUEST_KEY = 'user'

export const AuthKind = {
  Bearer: 'Bearer',
  APIKey: 'APIKey',
  None: 'None',
} as const

export type AuthType = (typeof AuthKind)[keyof typeof AuthKind]

export const ConditionGuard = {
  And: 'And',
  Or: 'Or',
} as const

export type ConditionGuardType = (typeof ConditionGuard)[keyof typeof ConditionGuard]

export type AuthGuardPayloadType = {
  authTypes: AuthType[]
  condition: ConditionGuardType
}
