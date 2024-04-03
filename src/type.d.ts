import { Request } from 'express'
import User from './models/schemas/User.schemas'
import { TokenPayload } from './interfaces/requests/Auth.requests'

declare module 'express' {
  interface Request {
    user?: User
    decodedAuthorization?: TokenPayload
    decodedRefreshToken?: TokenPayload
  }
}
