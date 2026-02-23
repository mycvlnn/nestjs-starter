import { Global, Module } from '@nestjs/common'
import { PrismaService } from './services/prisma.service.js'
import { JwtModule } from '@nestjs/jwt'
import { HashsingService } from './services/hashsing.service.js'
import { TokenService } from './services/token.service.js'
import { APP_GUARD } from '@nestjs/core'
import { AccessTokenGuard } from './guards/access-token.guard.js'
import { ApiKeyGuard } from './guards/api-key.guard.js'
import { AuthenticationGuard } from './guards/authentication.guard.js'

const sharedServices = [PrismaService, HashsingService, TokenService]

@Global()
@Module({
  imports: [JwtModule],
  providers: [
    ...sharedServices,
    AccessTokenGuard,
    ApiKeyGuard,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
  ],
  exports: sharedServices,
})
export class SharedModule {}
