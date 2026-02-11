import 'dotenv/config'
import { plainToInstance } from 'class-transformer'
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator'
import { existsSync } from 'fs'
import { resolve } from 'path'

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class EnvironmentVariables {
  @IsString()
  DATABASE_URL: string

  @IsNumber()
  PORT: number

  @IsEnum(Environment)
  NODE_ENV: Environment

  @IsString()
  ACCESS_TOKEN_SECRET: string

  @IsString()
  REFRESH_TOKEN_SECRET: string

  @IsString()
  ACCESS_TOKEN_EXPIRES_IN: string

  @IsString()
  REFRESH_TOKEN_EXPIRES_IN: string
}

function validate(config: Record<string, unknown>) {
  const envPath = resolve(process.cwd(), '.env')

  if (!existsSync(envPath)) {
    throw new Error(`File .env doesn't exist in path: ${envPath}`)
  }

  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  })

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  })

  if (errors.length > 0) {
    throw new Error(errors.toString())
  }

  return validatedConfig
}

export const envConfig = validate(process.env)
