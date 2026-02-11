export interface TokenDecodedPayload {
  userId: number
  jti: string
  iat: number
  exp: number
}

export interface SignTokenParams {
  userId: number
}
