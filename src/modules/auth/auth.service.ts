import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from '../../shared/services/prisma.service.js'
import { LoginDto, RegisterDto, UserResDto } from './auth.dto.js'
import { HashsingService } from '../../shared/services/hashsing.service.js'
import { TokenService } from '../../shared/services/token.service.js'
import { isJwtError, isPrismaDuplicateKeyError, isPrismaNotFoundError } from '../../common/guards/error.guard.js'
import { ValidationException } from '../../shared/exceptions/validation.exception.js'

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

      const { accessToken, refreshToken } = await this.generateTokens(user.id)

      return {
        user: new UserResDto(user),
        accessToken,
        refreshToken,
      }
    } catch (error) {
      if (isPrismaDuplicateKeyError(error)) {
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
      throw new ValidationException({
        field: 'email',
        error: 'Email not found',
      })
    }

    const isPasswordValid = await this.hashingService.compare(dto.password, user.password)

    if (!isPasswordValid) {
      throw new ValidationException({
        field: 'password',
        error: 'Invalid password',
      })
    }

    const { accessToken, refreshToken } = await this.generateTokens(user.id)

    return {
      user: new UserResDto(user),
      accessToken,
      refreshToken,
    }
  }

  async refreshToken(token: string) {
    try {
      // Xác thực refresh token
      const { userId } = this.tokenService.verifyRefreshToken(token)

      // Kiểm tra refresh token có tồn tại trong database không. Nếu không có -> văng lỗi
      const storedToken = await this.prisma.refreshToken.findUniqueOrThrow({
        where: {
          token,
        },
      })

      // Kiểm tra refresh token đã hết hạn chưa. Nếu đã hết hạn -> văng lỗi
      if (storedToken.expiresAt < new Date()) {
        throw new UnauthorizedException('Refresh token has expired')
      }

      // Xoá refresh token cũ
      await this.prisma.refreshToken.delete({
        where: {
          token,
        },
      })

      // Tạo lại access token mới và refresh token mới (nhưng expiresIn vẫn giữ nguyên)
      const accessToken = this.tokenService.signAcessToken({ userId })
      const oldExpiresInRefreshToken = (storedToken.expiresAt.getTime() - Date.now()) / 1000 // in seconds
      const newRefreshToken = this.tokenService.signRefreshToken({ userId }, Math.round(oldExpiresInRefreshToken))

      // Lưu refreshToken vào database
      await this.prisma.refreshToken.create({
        data: {
          userId,
          token: newRefreshToken,
          expiresAt: storedToken.expiresAt,
        },
      })

      return {
        accessToken,
        refreshToken: newRefreshToken,
      }
    } catch (error) {
      if (isPrismaNotFoundError(error)) {
        throw new UnauthorizedException('Refresh token revoked')
      }

      if (isJwtError(error)) {
        throw new UnauthorizedException('Invalid refresh token')
      }

      throw error
    }
  }

  // Xử lý tạo ra accessToken và refreshToken sau đó lưu thông tin vào database refreshToken
  private async generateTokens(userId: number) {
    const accessToken = this.tokenService.signAcessToken({ userId })
    const refreshToken = this.tokenService.signRefreshToken({ userId })
    const decodedRefreshToken = this.tokenService.verifyRefreshToken(refreshToken)

    // Lưu refreshToken vào database
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
