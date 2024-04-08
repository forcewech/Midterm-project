import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { IResponseMessage } from '~/interfaces/reponses/response'
import { IStatusReqBody } from '~/interfaces/requests/Status.requests'
import Status from '~/models/schemas/Status.schemas'
import statusService from '~/services/status.services'

class StatusController {
  async create(
    req: Request<ParamsDictionary, any, IStatusReqBody>,
    res: Response
  ): Promise<Response<IResponseMessage<typeof Status>>> {
    try {
      const result = await statusService.createStatus(req.body)
      return res.status(201).json(result)
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
      const result = await statusService.updateStatus(req.body, statusId)
      return res.json(result)
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
  async getAllStatus(req: Request, res: Response): Promise<Response<IResponseMessage<typeof Status>[]>> {
    try {
      const result = await statusService.getAllStatus()
      return res.json(result)
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
      const result = await statusService.hiddenStatus(statusId)
      return res.json(result)
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
}

const statusController = new StatusController()
export default statusController
