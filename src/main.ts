import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module.js'
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common'
import { envConfig } from './config/env.validation.js'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory(errors) {
        const formattedErrors = errors.map((err) => ({
          field: err.property,
          error: Object.values(err.constraints ?? {}).join(', '),
        }))

        return new UnprocessableEntityException({
          message: 'Validation failed',
          errors: formattedErrors,
        })
      },
    }),
  )

  const port = envConfig.PORT ?? 3000
  console.log(`Application starting on port ${port}`)

  await app.listen(port)
}

bootstrap()
