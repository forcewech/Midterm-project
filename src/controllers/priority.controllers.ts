import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import HTTP_STATUS from '~/constants/httpStatus'
import { priorityMessages } from '~/constants/messages'
import { IResponseMessage } from '~/interfaces/reponses/response'
import { IPriorityReqBody } from '~/interfaces/requests'
import { Priority } from '~/models/schemas'
import { priorityService } from '~/services'

class PriorityController {
  async create(
    req: Request<ParamsDictionary, any, IPriorityReqBody>,
    res: Response
  ): Promise<Response<IResponseMessage<typeof Priority>>> {
    try {
      const data = await priorityService.createPriority(req.body)
      return res.status(HTTP_STATUS.CREATED).json({
        success: true,
        code: HTTP_STATUS.CREATED,
        message: priorityMessages.CREATE_PRIORITY_SUCCESS,
        data
      })
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
  async update(
    req: Request<ParamsDictionary, any, IPriorityReqBody>,
    res: Response
  ): Promise<Response<IResponseMessage<typeof Priority>>> {
    try {
      const priorityId = req.params.priorityId
      const data = await priorityService.updatePriority(req.body, priorityId)
      return res.json({
        success: true,
        code: HTTP_STATUS.OK,
        message: priorityMessages.UPDATE_PRIORITY_SUCCESS,
        data
      })
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
  async getAllPriority(req: Request, res: Response): Promise<Response<IResponseMessage<typeof Priority>[]>> {
    try {
      const data = await priorityService.getAllPriority()
      return res.json({
        success: true,
        code: HTTP_STATUS.OK,
        message: priorityMessages.GET_ALL_PRIORITY_SUCCESS,
        data
      })
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
  async hiddenPriority(
    req: Request<ParamsDictionary, any, IPriorityReqBody>,
    res: Response
  ): Promise<Response<IResponseMessage<null>>> {
    try {
      const priorityId = req.params.priorityId
      await priorityService.hiddenPriority(priorityId)
      return res.json({
        success: true,
        code: HTTP_STATUS.OK,
        message: priorityMessages.PRIORITY_HIDDEN_SUCCESS
      })
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
}

const priorityController = new PriorityController()
export { priorityController }
