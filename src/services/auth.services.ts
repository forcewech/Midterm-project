import { ObjectId } from 'mongodb'
import { TokenType } from '~/constants/enums'
import { authMessages } from '~/constants/messages'
import { IRegisterReqBody } from '~/models/requests/Auth.requests'
import RefreshToken from '~/models/schemas/RefreshToken.schemas'
import User from '~/models/schemas/User.schemas'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'

class AuthService {
  private signAccessToken(userId: string): Promise<string> {
    return signToken({
      payload: {
        userId,
        tokenType: TokenType.AccessToken
      },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
      }
    })
  }
  private signRefreshToken(userId: string): Promise<string> {
    return signToken({
      payload: {
        userId,
        tokenType: TokenType.RefreshToken
      },
      privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
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
  async register(payload: IRegisterReqBody): Promise<{
    accessToken: string
    refreshToken: string
  }> {
    const userId = new ObjectId()
    const newUser = new User({
      ...payload,
      _id: userId,
      password: hashPassword(payload.password)
    })
    const [accessToken, refreshToken] = await this.signAccessAndRefreshToken(userId.toString())
    const newRefreshToken = new RefreshToken({ userId: new ObjectId(userId), token: refreshToken })
    await Promise.all([newRefreshToken.save(), await newUser.save()])
    return {
      accessToken,
      refreshToken
    }
  }
  async login(userId: string): Promise<{
    accessToken: string
    refreshToken: string
  }> {
    const [accessToken, refreshToken] = await this.signAccessAndRefreshToken(userId)
    const newRefreshToken = new RefreshToken({ userId: new ObjectId(userId), token: refreshToken })
    await newRefreshToken.save()
    return {
      accessToken,
      refreshToken
    }
  }
  async logout(refreshToken: string): Promise<{
    message: string
  }> {
    await RefreshToken.deleteOne({ token: refreshToken })
    return {
      message: authMessages.LOGOUT_SUCCESS
    }
  }
}

const authService = new AuthService()
export default authService
