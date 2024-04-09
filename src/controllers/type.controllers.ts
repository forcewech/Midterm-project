import { ITypeReqBody } from '~/interfaces/requests/Type.requests'
import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import Type from '~/models/schemas/Type.schemas'
import { IResponseMessage } from '~/interfaces/reponses/response'
import typeService from '~/services/type.services'
import HTTP_STATUS from '~/constants/httpStatus'

class TypeController {
  async create(
    req: Request<ParamsDictionary, any, ITypeReqBody>,
    res: Response
  ): Promise<Response<IResponseMessage<typeof Type>>> {
    try {
      const result = await typeService.createType(req.body)
      return res.status(HTTP_STATUS.CREATED).json(result)
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
  async update(
    req: Request<ParamsDictionary, any, ITypeReqBody>,
    res: Response
  ): Promise<Response<IResponseMessage<typeof Type>>> {
    try {
      const typeId = req.params.typeId
      const result = await typeService.updateType(req.body, typeId)
      return res.json(result)
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
  async getAllType(req: Request, res: Response): Promise<Response<IResponseMessage<typeof Type>[]>> {
    try {
      const result = await typeService.getAllType()
      return res.json(result)
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
  async hiddenType(
    req: Request<ParamsDictionary, any, ITypeReqBody>,
    res: Response
  ): Promise<Response<IResponseMessage<typeof Type>>> {
    try {
      const typeId = req.params.typeId
      const result = await typeService.hiddenType(typeId)
      return res.json(result)
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
}

const typeController = new TypeController()
export default typeController
