import { ConflictException, Injectable, UnprocessableEntityException } from '@nestjs/common'
import { PrismaService } from '../../shared/services/prisma.service.js'
import { LoginDto, RegisterDto, UserDto } from './auth.dto.js'
import { HashsingService } from '../../shared/services/hashsing.service.js'
import { TokenService } from '../../shared/services/token.service.js'
import { Prisma } from '../../../generated/prisma/client.js'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly hashingService: HashsingService,
    private readonly tokenService: TokenService,
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

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    })

    if (!user) {
      throw new UnprocessableEntityException({
        message: 'Validation failed',
        errors: [{ field: 'email', error: 'Email does not exist' }],
      })
    }

    const isPasswordValid = await this.hashingService.compare(dto.password, user.password)

    if (!isPasswordValid) {
      throw new UnprocessableEntityException({
        message: 'Validation failed',
        errors: [{ field: 'password', error: 'Invalid password' }],
      })
    }

    const { accessToken, refreshToken } = await this.generateTokens(user.id)

    return {
      user: new UserDto(user),
      accessToken,
      refreshToken,
    }
  }

  // Xử lý tạo ra accessToken và refreshToken sau đó lưu thông tin vào database refreshToken
  async generateTokens(userId: number) {
    const accessToken = this.tokenService.signAcessToken({ userId })
    const refreshToken = this.tokenService.signRefreshToken({ userId })
    const decodedRefreshToken = this.tokenService.verifyRefreshToken(refreshToken)

    // Lưu refreshToken vào database (giả sử bạn có một bảng RefreshToken)
    await this.prisma.refreshToken.create({
      data: {
        userId,
        token: refreshToken,
        expiresAt: new Date(decodedRefreshToken.exp * 1000),
      },
    })

    return { accessToken, refreshToken }
  }
}
