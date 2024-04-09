import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '~/constants/constant'
import HTTP_STATUS from '~/constants/httpStatus'
import { userMessages } from '~/constants/messages/user.messages'
import { IResponseMessage } from '~/interfaces/reponses/response'
import { IUpdateUser } from '~/interfaces/requests/User.requests'
import InviteId from '~/models/schemas/InviteId.schemas'
import User from '~/models/schemas/User.schemas'
import userService from '~/services/user.services'
class UserController {
  async createInviteId(req: Request, res: Response): Promise<Response<IResponseMessage<typeof InviteId>>> {
    try {
      const data = await userService.createInviteId(req.body.projectId)
      return res.status(HTTP_STATUS.CREATED).json({
        success: true,
        code: HTTP_STATUS.CREATED,
        message: userMessages.CREATE_INVITE_ID_SUCCESS,
        data
      })
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
  async getAllUser(req: Request, res: Response): Promise<Response<IResponseMessage<typeof User>[]>> {
    try {
      const page = parseInt(req.query.page as string) || DEFAULT_PAGE
      const pageSize = parseInt(req.query.limit as string) || DEFAULT_LIMIT
      const data = await userService.getAllUser(page, pageSize)
      return res.json({
        success: true,
        code: HTTP_STATUS.OK,
        message: userMessages.GET_ALL_USER_WITH_PAGINATE_SUCCESS,
        data
      })
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
  async getUser(req: Request, res: Response): Promise<Response<IResponseMessage<typeof User>>> {
    try {
      const userId = req.params.userId
      const data = await userService.getUserById(userId)
      return res.json({
        success: true,
        code: HTTP_STATUS.OK,
        message: userMessages.GET_USER_SUCCESS,
        data
      })
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
  async delete(req: Request, res: Response): Promise<Response<IResponseMessage<typeof User>>> {
    try {
      const userId = req.params.userId
      await userService.deleteUserById(userId)
      return res.json({
        success: true,
        code: HTTP_STATUS.OK,
        message: userMessages.DELETE_USER_SUCCESS
      })
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
      const data = await userService.updateUserById(userId, req.body)
      return res.json({
        success: true,
        code: HTTP_STATUS.OK,
        message: userMessages.UPDATE_USER_SUCCESS,
        data
      })
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
}
const userController = new UserController()
export default userController
