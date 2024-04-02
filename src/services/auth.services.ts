import { ObjectId } from 'mongodb'
import {
  ACCESS_TOKEN_EXPIRES_IN,
  JWT_SECRET_ACCESS_TOKEN,
  JWT_SECRET_REFRESH_TOKEN,
  REFRESH_TOKEN_EXPIRES_IN
} from '~/config/env-config'
import { ETokenType } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { authMessages } from '~/constants/messages/auth.messages'
import { IResponseMessage } from '~/interfaces/reponses/response'
import { IRegisterReqBody, IToken } from '~/interfaces/requests/Auth.requests'
import RefreshToken from '~/models/schemas/RefreshToken.schemas'
import User from '~/models/schemas/User.schemas'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'

class AuthService {
  private async signAccessToken(userId: string): Promise<string> {
    return signToken({
      payload: {
        userId,
        tokenType: ETokenType.ACCESS_TOKEN
      },
      privateKey: JWT_SECRET_ACCESS_TOKEN as string,
      options: {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN
      }
    })
  }
  private async signRefreshToken(userId: string): Promise<string> {
    return signToken({
      payload: {
        userId,
        tokenType: ETokenType.REFRESH_TOKEN
      },
      privateKey: JWT_SECRET_REFRESH_TOKEN,
      options: {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN
      }
    })
  }
  private async signAccessAndRefreshToken(userId: string): Promise<[string, string]> {
    return await Promise.all([this.signAccessToken(userId), this.signRefreshToken(userId)])
  }
  async checkUserNameExist(userName: string): Promise<boolean> {
    const user = await User.findOne({ userName })
    return Boolean(user)
  }
  async register(payload: IRegisterReqBody): Promise<IResponseMessage<IToken>> {
    const newUser = new User({
      ...payload,
      password: hashPassword(payload.password)
    })
    await newUser.save()
    const [accessToken, refreshToken] = await this.signAccessAndRefreshToken(newUser._id.toString())
    const newRefreshToken = new RefreshToken({ userId: newUser._id, token: refreshToken })
    await newRefreshToken.save()
    return {
      success: true,
      code: HTTP_STATUS.OK,
      message: authMessages.REGISTER_SUCCESS,
      data: {
        accessToken,
        refreshToken
      }
    }
  }
  async login(userId: string): Promise<IResponseMessage<IToken>> {
    const [accessToken, refreshToken] = await this.signAccessAndRefreshToken(userId)
    const newRefreshToken = new RefreshToken({ userId: new ObjectId(userId), token: refreshToken })
    await newRefreshToken.save()
    return {
      success: true,
      code: HTTP_STATUS.OK,
      message: authMessages.LOGIN_SUCCESS,
      data: {
        accessToken,
        refreshToken
      }
    }
  }
  async logout(refreshToken: string): Promise<IResponseMessage<null>> {
    await RefreshToken.deleteOne({ token: refreshToken })
    return {
      success: true,
      code: HTTP_STATUS.OK,
      message: authMessages.LOGOUT_SUCCESS
    }
  }
}

const authService = new AuthService()
export default authService
