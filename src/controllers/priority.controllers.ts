import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import HTTP_STATUS from '~/constants/httpStatus'
import { IResponseMessage } from '~/interfaces/reponses/response'
import { IPriorityReqBody } from '~/interfaces/requests/Priority.requests'
import Priority from '~/models/schemas/Priority.schemas'
import priorityService from '~/services/priority.services'

class PriorityController {
  async create(
    req: Request<ParamsDictionary, any, IPriorityReqBody>,
    res: Response
  ): Promise<Response<IResponseMessage<typeof Priority>>> {
    try {
      const result = await priorityService.createPriority(req.body)
      return res.status(HTTP_STATUS.CREATED).json(result)
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
      const result = await priorityService.updatePriority(req.body, priorityId)
      return res.json(result)
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
  async getAllPriority(req: Request, res: Response): Promise<Response<IResponseMessage<typeof Priority>[]>> {
    try {
      const result = await priorityService.getAllPriority()
      return res.json(result)
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
  async hiddenPriority(
    req: Request<ParamsDictionary, any, IPriorityReqBody>,
    res: Response
  ): Promise<Response<IResponseMessage<typeof Priority>>> {
    try {
      const priorityId = req.params.priorityId
      const result = await priorityService.hiddenPriority(priorityId)
      return res.json(result)
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
}

const priorityController = new PriorityController()
export default priorityController
