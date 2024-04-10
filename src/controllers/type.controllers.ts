import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import HTTP_STATUS from '~/constants/httpStatus'
import { typeMessages } from '~/constants/messages'
import { IResponseMessage } from '~/interfaces/reponses/response'
import { ITypeReqBody } from '~/interfaces/requests'
import { Type } from '~/models/schemas'
import { typeService } from '~/services'

class TypeController {
  async create(
    req: Request<ParamsDictionary, any, ITypeReqBody>,
    res: Response
  ): Promise<Response<IResponseMessage<typeof Type>>> {
    try {
      const data = await typeService.createType(req.body)
      return res.status(HTTP_STATUS.CREATED).json({
        success: true,
        code: HTTP_STATUS.CREATED,
        message: typeMessages.CREATE_TYPE_SUCCESS,
        data
      })
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
      const data = await typeService.updateType(req.body, typeId)
      return res.json({
        success: true,
        code: HTTP_STATUS.OK,
        message: typeMessages.UPDATE_TYPE_SUCCESS,
        data
      })
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
  async getAllType(req: Request, res: Response): Promise<Response<IResponseMessage<typeof Type>[]>> {
    try {
      const data = await typeService.getAllType()
      return res.json({
        success: true,
        code: HTTP_STATUS.OK,
        message: typeMessages.GET_ALL_TYPE_SUCCESS,
        data
      })
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
      await typeService.hiddenType(typeId)
      return res.json({
        success: true,
        code: HTTP_STATUS.OK,
        message: typeMessages.TYPE_HIDDEN_SUCCESS
      })
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
}

const typeController = new TypeController()
export { typeController }
