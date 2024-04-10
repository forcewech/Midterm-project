import { Request } from 'express'
import User from './models/schemas/User.schemas'
import { ITokenPayload } from './interfaces/requests/Auth.requests'

declare module 'express' {
  interface Request {
    user?: User
    decodedAuthorization?: ITokenPayload
    decodedRefreshToken?: ITokenPayload
    decodedTokenInvite?: ITokenPayload
    startDateProject?: Date
    endDateProject?: Date
    defaultNew?: string
  }
}
