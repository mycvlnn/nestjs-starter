import { Injectable } from '@nestjs/common'
import { hash, compare } from 'bcrypt'

@Injectable()
export class HashsingService {
  saltRounds = 10
  hash(value: string) {
    return hash(value, this.saltRounds)
  }

  compare(value: string, hashedValue: string) {
    return compare(value, hashedValue)
  }
}
