import { ConflictException, Injectable } from '@nestjs/common'
import { PrismaService } from '../../shared/services/prisma.service.js'
import { RegisterDto, UserDto } from './auth.dto.js'
import { HashsingService } from '../../shared/services/hashsing.service.js'
import { Prisma } from '../../../generated/prisma/client.js'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly hashingService: HashsingService,
  ) {}

  async register(dto: RegisterDto) {
    try {
      const hashedPassword = await this.hashingService.hash(dto.password)

      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          name: dto.name,
          password: hashedPassword,
        },
      })

      return new UserDto(user)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Email already exists')
      }
      throw error
    }
  }
}
