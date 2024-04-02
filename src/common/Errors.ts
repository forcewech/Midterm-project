import httpStatus from '~/constants/httpStatus'
import { authMessages } from '~/constants/messages/auth.messages'

type ErrorsType = Record<
  string,
  {
    msg: string
    [key: string]: any
  }
>

export class ErrorWithStatus {
  success: boolean
  code: number
  message: string
  constructor({ success, code, message }: { success: boolean; code: number; message: string }) {
    this.success = success
    this.code = code
    this.message = message
  }
}

export class EntityError extends ErrorWithStatus {
  errors: ErrorsType
  constructor({ errors }: { errors: ErrorsType }) {
    super({ success: false, code: httpStatus.UNPROCESSABLE_ETITY, message: authMessages.VALIDATION_ERROR })
    this.errors = errors
  }
}
