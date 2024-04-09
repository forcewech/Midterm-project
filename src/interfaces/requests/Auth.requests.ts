import { JwtPayload } from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import { ETokenType } from '~/constants/enums'

export interface IRegisterReqBody {
  userName: string
  name: string
  email: string
  password: string
  inviteId: string
  dateOfBirth: string
  projects: ObjectId[]
}

export interface IToken {
  accessToken: string
  refreshToken: string
}

export interface ILoginReqBody {
  userName: string
  password: string
}

export interface ILogoutReqBody {
  refreshToken: string
}

export interface ITokenPayload extends JwtPayload {
  userId: string
  tokenType: ETokenType
  projectId: string
}
