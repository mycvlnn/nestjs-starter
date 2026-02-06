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
  JWT_SECRET: string
}

export function validate(config: Record<string, unknown>) {
  const envPath = resolve(process.cwd(), '.env')

  if (!existsSync(envPath)) {
    throw new Error(`File .env không tồn tại tại đường dẫn: ${envPath}`)
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
