import { Global, Module } from '@nestjs/common'
import { PrismaService } from './services/prisma.service.js'
import { JwtModule } from '@nestjs/jwt'
import { HashsingService } from './services/hashsing.service.js'
import { TokenService } from './services/token.service.js'
import { APP_GUARD } from '@nestjs/core'
import { AccessTokenGuard } from './guards/access-token.guard.js'

const sharedServices = [PrismaService, HashsingService, TokenService]

@Global()
@Module({
  imports: [JwtModule],
  providers: [
    ...sharedServices,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
  exports: sharedServices,
})
export class SharedModule {}
