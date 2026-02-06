import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from '../generated/prisma/client.js'
import { envConfig } from '../src/config/env.validation.js'

const adapter = new PrismaBetterSqlite3({ url: envConfig.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

// Dùng prisma bên ngoài module NestJS
export { prisma }
