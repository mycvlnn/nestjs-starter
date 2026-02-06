import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module.js'
import { ValidationPipe } from '@nestjs/common'
import { envConfig } from './config/env.validation.js'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )

  const port = envConfig.PORT ?? 3000
  console.log(`Application starting on port ${port}`)

  await app.listen(port)
}

bootstrap()
