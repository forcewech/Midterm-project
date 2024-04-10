import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import HTTP_STATUS from '~/constants/httpStatus'
import { statusMessages } from '~/constants/messages'
import { IResponseMessage } from '~/interfaces/reponses/response'
import { IStatusReqBody } from '~/interfaces/requests'
import { Status } from '~/models/schemas'
import { statusService } from '~/services'

class StatusController {
  async create(
    req: Request<ParamsDictionary, any, IStatusReqBody>,
    res: Response
  ): Promise<Response<IResponseMessage<typeof Status>>> {
    try {
      const data = await statusService.createStatus(req.body)
      return res.status(HTTP_STATUS.CREATED).json({
        success: true,
        code: HTTP_STATUS.CREATED,
        message: statusMessages.CREATE_STATUS_SUCCESS,
        data
      })
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
  async update(
    req: Request<ParamsDictionary, any, IStatusReqBody>,
    res: Response
  ): Promise<Response<IResponseMessage<typeof Status>>> {
    try {
      const statusId = req.params.statusId
      const data = await statusService.updateStatus(req.body, statusId)
      return res.json({
        success: true,
        code: HTTP_STATUS.OK,
        message: statusMessages.UPDATE_STATUS_SUCCESS,
        data
      })
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
  async getAllStatus(req: Request, res: Response): Promise<Response<IResponseMessage<typeof Status>[]>> {
    try {
      const data = await statusService.getAllStatus()
      return res.json({
        success: true,
        code: HTTP_STATUS.OK,
        message: statusMessages.GET_ALL_STATUS_SUCCESS,
        data
      })
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
  async hiddenStatus(
    req: Request<ParamsDictionary, any, IStatusReqBody>,
    res: Response
  ): Promise<Response<IResponseMessage<typeof Status>>> {
    try {
      const statusId = req.params.statusId
      await statusService.hiddenStatus(statusId)
      return res.json({
        success: true,
        code: HTTP_STATUS.OK,
        message: statusMessages.STATUS_HIDDEN_SUCCESS
      })
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
}

const statusController = new StatusController()
export { statusController }
