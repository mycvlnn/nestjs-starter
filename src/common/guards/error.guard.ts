import { JsonWebTokenError } from '@nestjs/jwt'
import { Prisma } from '../../../generated/prisma/client.js'

export function isPrismaError(error: unknown): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError
}

export function isJwtError(error: unknown): error is JsonWebTokenError {
  return error instanceof JsonWebTokenError
}

export function isJwtTokenExpiredError(error: unknown): error is JsonWebTokenError {
  return isJwtError(error) && error.name === 'TokenExpiredError'
}

export function isPrismaDuplicateKeyError(
  error: unknown,
): error is Prisma.PrismaClientKnownRequestError {
  return isPrismaError(error) && error.code === 'P2002'
}

export function isPrismaNotFoundError(
  error: unknown,
): error is Prisma.PrismaClientKnownRequestError {
  return isPrismaError(error) && error.code === 'P2025'
}
