import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { client } from '~/config/connectRedis'
import HTTP_STATUS from '~/constants/httpStatus'
import { authMessages } from '~/constants/messages'
import { IResponseMessage } from '~/interfaces/reponses/response'
import { ILoginReqBody, ILogoutReqBody, IRegisterReqBody, IToken } from '~/interfaces/requests'
import { authService } from '~/services'

class AuthController {
  async register(
    req: Request<ParamsDictionary, any, IRegisterReqBody>,
    res: Response
  ): Promise<Response<IResponseMessage<IToken>>> {
    try {
      const projectId = req.decodedTokenInvite?.projectId
      const data = await authService.register(req.body, new ObjectId(projectId))
      return res.json({
        success: true,
        code: HTTP_STATUS.OK,
        message: authMessages.REGISTER_SUCCESS,
        data
      })
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
  async login(
    req: Request<ParamsDictionary, any, ILoginReqBody>,
    res: Response
  ): Promise<Response<IResponseMessage<IToken>>> {
    try {
      const user = req.user
      const userId = user._id as ObjectId
      const role = user.role
      const data = await authService.login(userId.toString(), role)
      return res.json({
        success: true,
        code: HTTP_STATUS.OK,
        message: authMessages.LOGIN_SUCCESS,
        data
      })
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
  async logout(
    req: Request<ParamsDictionary, any, ILogoutReqBody>,
    res: Response
  ): Promise<Response<IResponseMessage<null>>> {
    try {
      const { refreshToken } = req.body
      const accessToken = req.headers.authorization?.split(' ')[1]
      await client.del(`user_${accessToken}`)
      await authService.logout(refreshToken)
      return res.json({
        success: true,
        code: HTTP_STATUS.OK,
        message: authMessages.LOGOUT_SUCCESS
      })
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
  async refreshToken(
    req: Request<ParamsDictionary, any, ILogoutReqBody>,
    res: Response
  ): Promise<Response<IResponseMessage<IToken>>> {
    try {
      const { refreshToken } = req.body
      const userId = req.decodedRefreshToken?.user_id as string
      const role = req.decodedRefreshToken?.role
      const data = await authService.refreshToken(refreshToken, userId, role)
      return res.json({
        success: true,
        code: HTTP_STATUS.OK,
        message: authMessages.GET_ACCESS_TOKEN_AND_REFRESH_TOKEN_SUCCESS,
        data
      })
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
}

const authController = new AuthController()
export { authController }
