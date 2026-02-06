import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module.js'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )

  const configService = app.get(ConfigService)
  const port = configService.get<number>('PORT', 3000)
  console.log(`Application starting on port ${port}`)

  await app.listen(port)
}
bootstrap()
