import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from '../../../generated/prisma/client.js'

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(private configService: ConfigService) {
    const connectionString = configService.get<string>('DATABASE_URL', 'file:./dev.db')
    const adapter = new PrismaBetterSqlite3({ url: connectionString })
    super({ adapter })
  }
}
