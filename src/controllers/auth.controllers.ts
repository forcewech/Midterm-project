import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { authMessages } from '~/constants/messages'
import { ILoginReqBody, ILogoutReqBody, IRegisterReqBody, IToken } from '~/models/requests/Auth.requests'
import authService from '~/services/auth.services'
class AuthController {
  async register(
    req: Request<ParamsDictionary, any, IRegisterReqBody>,
    res: Response,
    next: NextFunction
  ): Promise<Response<string, Record<string, IToken>> | undefined> {
    try {
      const result = await authService.register(req.body)
      return res.json({
        message: authMessages.REGISTER_SUCCESS,
        result
      })
    } catch (error) {
      next(error)
    }
  }
  async login(
    req: Request<ParamsDictionary, any, ILoginReqBody>,
    res: Response,
    next: NextFunction
  ): Promise<Response<string, Record<string, IToken>> | undefined> {
    try {
      const user = req.user
      const userId = user._id as ObjectId
      const result = await authService.login(userId.toString())
      return res.json({
        message: authMessages.LOGIN_SUCCESS,
        result
      })
    } catch (error) {
      next(error)
    }
  }
  async logout(
    req: Request<ParamsDictionary, any, ILogoutReqBody>,
    res: Response,
    next: NextFunction
  ): Promise<Response<string, Record<string, IToken>> | undefined> {
    try {
      const { refreshToken } = req.body
      const result = await authService.logout(refreshToken)
      return res.json(result)
    } catch (error) {
      next(error)
    }
  }
}

const authController = new AuthController()
export default authController
