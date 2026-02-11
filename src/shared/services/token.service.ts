import { Injectable } from '@nestjs/common'
import { JwtService, JwtSignOptions } from '@nestjs/jwt'
import { envConfig } from '../../config/env.validation.js'
import { SignTokenParams, TokenDecodedPayload } from 'src/types/jwt.type.js'

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  signAcessToken(payload: SignTokenParams): string {
    return this.jwtService.sign(
      {
        ...payload,
        jti: crypto.randomUUID(), // Unique identifier for the token
      },
      {
        secret: envConfig.ACCESS_TOKEN_SECRET,
        expiresIn: envConfig.ACCESS_TOKEN_EXPIRES_IN as JwtSignOptions['expiresIn'],
      },
    )
  }

  signRefreshToken(
    payload: SignTokenParams,
    expiresIn = envConfig.REFRESH_TOKEN_EXPIRES_IN as JwtSignOptions['expiresIn'],
  ): string {
    return this.jwtService.sign(
      {
        ...payload,
        jti: crypto.randomUUID(),
      },
      {
        secret: envConfig.REFRESH_TOKEN_SECRET,
        expiresIn,
      },
    )
  }

  verifyAcessToken(token: string): TokenDecodedPayload {
    return this.jwtService.verify(token, {
      secret: envConfig.ACCESS_TOKEN_SECRET,
    })
  }

  verifyRefreshToken(token: string): TokenDecodedPayload {
    return this.jwtService.verify(token, {
      secret: envConfig.REFRESH_TOKEN_SECRET,
    })
  }
}
