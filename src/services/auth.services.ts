import { DeleteResult, ObjectId } from 'mongodb'
import { client } from '~/config/connectRedis'
import {
  ACCESS_TOKEN_EXPIRES_IN,
  JWT_SECRET_ACCESS_TOKEN,
  JWT_SECRET_REFRESH_TOKEN,
  REFRESH_TOKEN_EXPIRES_IN
} from '~/config/env-config'
import { ETokenType } from '~/constants/enums'
import { IRegisterReqBody, IToken } from '~/interfaces/requests'
import { InviteId, Project, RefreshToken, User } from '~/models/schemas'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'

class AuthService {
  private async signAccessToken(userId: string, role: string): Promise<string> {
    return signToken({
      payload: {
        userId,
        role,
        tokenType: ETokenType.ACCESS_TOKEN
      },
      privateKey: JWT_SECRET_ACCESS_TOKEN as string,
      options: {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN
      }
    })
  }
  private async signRefreshToken(userId: string, role: string): Promise<string> {
    return signToken({
      payload: {
        userId,
        role,
        tokenType: ETokenType.REFRESH_TOKEN
      },
      privateKey: JWT_SECRET_REFRESH_TOKEN,
      options: {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN
      }
    })
  }
  private async signAccessAndRefreshToken(userId: string, role: string): Promise<[string, string]> {
    return await Promise.all([this.signAccessToken(userId, role), this.signRefreshToken(userId, role)])
  }
  async checkUserNameExist(userName: string): Promise<boolean> {
    const user = await User.findOne({ userName })
    return Boolean(user)
  }
  async checkUserEmailExist(email: string): Promise<boolean> {
    const user = await User.findOne({ email })
    return Boolean(user)
  }
  async register(payload: IRegisterReqBody, projectId: ObjectId): Promise<IToken> {
    if (!Array.isArray(payload.projects)) {
      payload.projects = []
    }
    const newUser = new User({
      ...payload,
      projects: [...payload.projects, projectId],
      password: hashPassword(payload.password)
    })
    await newUser.save()
    await Project.findByIdAndUpdate({ _id: projectId }, { $push: { participants: newUser._id } }, { new: true })
    const [accessToken, refreshToken] = await this.signAccessAndRefreshToken(newUser._id.toString(), newUser.role)
    const key = `user_${accessToken}`
    const expireTime = parseInt(ACCESS_TOKEN_EXPIRES_IN.slice(0, -1)) * 60
    client.set(key, accessToken, {
      EX: expireTime
    })
    const newRefreshToken = new RefreshToken({ userId: newUser._id, token: refreshToken })
    await newRefreshToken.save()
    await InviteId.findOneAndUpdate({ code: payload.inviteId }, { status: 'inactive' }, { new: true })
    return {
      accessToken,
      refreshToken
    }
  }
  async login(userId: string, role: string): Promise<IToken> {
    const [accessToken, refreshToken] = await this.signAccessAndRefreshToken(userId, role)
    const key = `user_${accessToken}`
    const expireTime = parseInt(ACCESS_TOKEN_EXPIRES_IN.slice(0, -1)) * 60
    client.set(key, accessToken, {
      EX: expireTime
    })
    const newRefreshToken = new RefreshToken({ userId: new ObjectId(userId), token: refreshToken })
    await newRefreshToken.save()
    return {
      accessToken,
      refreshToken
    }
  }
  async logout(refreshToken: string): Promise<DeleteResult> {
    return await RefreshToken.deleteOne({ token: refreshToken })
  }
  async refreshToken(refreshTokenOld: string, userId: string, role: string): Promise<IToken> {
    await RefreshToken.deleteOne({ token: refreshTokenOld })
    const [accessToken, refreshToken] = await this.signAccessAndRefreshToken(userId, role)
    const key = `user_${accessToken}`
    const expireTime = parseInt(ACCESS_TOKEN_EXPIRES_IN.slice(0, -1)) * 60
    client.set(key, accessToken, {
      EX: expireTime
    })
    const newRefreshToken = new RefreshToken({ userId: new ObjectId(userId), token: refreshToken })
    await newRefreshToken.save()
    return {
      accessToken,
      refreshToken
    }
  }
}

const authService = new AuthService()
export { authService }
