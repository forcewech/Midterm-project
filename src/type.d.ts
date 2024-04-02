import { Request } from 'express'
import User from './models/schemas/User.schemas'
import { TokenPayload } from './interfaces/requests/Auth.requests'

declare module 'express' {
  interface Request {
    user?: User
    decoded_authorization?: TokenPayload
    decoded_refresh_token?: TokenPayload
  }
}
