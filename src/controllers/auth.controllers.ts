import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { IResponseMessage } from '~/interfaces/reponses/response'
import { ILoginReqBody, ILogoutReqBody, IRegisterReqBody, IToken } from '~/interfaces/requests/Auth.requests'
import authService from '~/services/auth.services'
class AuthController {
  async register(
    req: Request<ParamsDictionary, any, IRegisterReqBody>,
    res: Response
  ): Promise<Response<IResponseMessage<IToken>>> {
    try {
      const projectId = req.decodedTokenInvite?.projectId
      const result = await authService.register(req.body, new ObjectId(projectId))
      return res.json(result)
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
      const result = await authService.login(userId.toString(), role)
      return res.json(result)
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
  async logout(
    req: Request<ParamsDictionary, any, ILogoutReqBody>,
    res: Response
  ): Promise<Response<IResponseMessage<IToken>>> {
    try {
      const { refreshToken } = req.body
      const result = await authService.logout(refreshToken)
      return res.json(result)
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
      const result = await authService.refreshToken(refreshToken, userId, role)
      return res.json(result)
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
}

const authController = new AuthController()
export default authController
