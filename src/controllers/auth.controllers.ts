import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { authMessages } from '~/constants/messages/auth.messages'
import { IResponseMessage } from '~/models/reponses/response'
import { ILoginReqBody, ILogoutReqBody, IRegisterReqBody, IToken } from '~/models/requests/Auth.requests'
import authService from '~/services/auth.services'
class AuthController {
  async register(
    req: Request<ParamsDictionary, any, IRegisterReqBody>,
    res: Response
  ): Promise<Response<IResponseMessage<IToken>>> {
    try {
      const result = await authService.register(req.body)
      return res.json({
        message: authMessages.REGISTER_SUCCESS,
        result
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
      const result = await authService.login(userId.toString())
      return res.json({
        message: authMessages.LOGIN_SUCCESS,
        result
      })
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
  async logout(req: Request<ParamsDictionary, any, ILogoutReqBody>, res: Response): Promise<Response<string>> {
    try {
      const { refreshToken } = req.body
      const result = await authService.logout(refreshToken)
      return res.json(result)
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
}

const authController = new AuthController()
export default authController
