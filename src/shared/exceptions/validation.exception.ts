import { UnprocessableEntityException } from '@nestjs/common'

interface ValidationError {
  field: string
  error: string
}

export class ValidationException extends UnprocessableEntityException {
  constructor(errors: ValidationError | ValidationError[]) {
    const errorArray = Array.isArray(errors) ? errors : [errors]

    super({
      message: 'Validation failed',
      errors: errorArray,
    })
  }
}
