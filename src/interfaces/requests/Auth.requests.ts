import { JwtPayload } from 'jsonwebtoken'
import { ETokenType } from '~/constants/enums'

export interface IRegisterReqBody {
  userName: string
  name: string
  email: string
  password: string
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

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: ETokenType
}
