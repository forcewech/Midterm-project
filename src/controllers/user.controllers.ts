import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { defaultLimit, defaultPage } from '~/constants/constant'
import HTTP_STATUS from '~/constants/httpStatus'
import { IResponseMessage } from '~/interfaces/reponses/response'
import { IUpdateUser } from '~/interfaces/requests/User.requests'
import InviteId from '~/models/schemas/InviteId.schemas'
import User from '~/models/schemas/User.schemas'
import userService from '~/services/user.services'
class UserController {
  async createInviteId(req: Request, res: Response): Promise<Response<IResponseMessage<typeof InviteId>>> {
    try {
      const result = await userService.createInviteId(req.body.projectId)
      return res.status(HTTP_STATUS.CREATED).json(result)
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
  async getAllUser(req: Request, res: Response): Promise<Response<IResponseMessage<typeof User>[]>> {
    try {
      const page = parseInt(req.query.page as string) || defaultPage
      const pageSize = parseInt(req.query.limit as string) || defaultLimit
      const result = await userService.getAllUser(page, pageSize)
      return res.json(result)
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
  async getUser(req: Request, res: Response): Promise<Response<IResponseMessage<typeof User>>> {
    try {
      const userId = req.params.userId
      const result = await userService.getUserById(userId)
      return res.json(result)
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
  async delete(req: Request, res: Response): Promise<Response<IResponseMessage<typeof User>>> {
    try {
      const userId = req.params.userId
      const result = await userService.deleteUserById(userId)
      return res.json(result)
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
  async update(
    req: Request<ParamsDictionary, any, IUpdateUser>,
    res: Response
  ): Promise<Response<IResponseMessage<typeof User>>> {
    try {
      const userId = req.params.userId
      const result = await userService.updateUserById(userId, req.body)
      return res.json(result)
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
}
const userController = new UserController()
export default userController
