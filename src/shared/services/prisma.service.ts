import { Injectable } from '@nestjs/common'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from '../../../generated/prisma/client.js'
import { envConfig } from '../../config/env.validation.js'

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const adapter = new PrismaBetterSqlite3({ url: envConfig.DATABASE_URL })
    super({ adapter })
  }
}
