import { Global, Module } from '@nestjs/common'
import { PrismaService } from './services/prisma.service.js'
import { HashsingService } from './services/hashsing.service.js'

const sharedServices = [PrismaService, HashsingService]

@Global()
@Module({
  providers: sharedServices,
  exports: sharedServices,
})
export class SharedModule {}
