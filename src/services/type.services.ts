import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { typeMessages } from '~/constants/messages/type.messages'
import { IResponseMessage } from '~/interfaces/reponses/response'
import { ITypeReqBody } from '~/interfaces/requests/Type.requests'
import Type from '~/models/schemas/Type.schemas'

class TypeService {
  async createType(payload: ITypeReqBody): Promise<IResponseMessage<InstanceType<typeof Type>>> {
    const newType = new Type({
      ...payload
    })
    await newType.save()
    return {
      success: true,
      code: HTTP_STATUS.CREATED,
      message: typeMessages.CREATE_TYPE_SUCCESS,
      data: newType
    }
  }
  async updateType(payload: ITypeReqBody, typeId: string): Promise<IResponseMessage<InstanceType<typeof Type>>> {
    const updateType = await Type.findByIdAndUpdate({ _id: new ObjectId(typeId) }, { ...payload }, { new: true })
    return {
      success: true,
      code: HTTP_STATUS.CREATED,
      message: typeMessages.UPDATE_TYPE_SUCCESS,
      data: updateType as InstanceType<typeof Type>
    }
  }
  async hiddenType(typeId: string): Promise<IResponseMessage<InstanceType<typeof Type>>> {
    await Type.findByIdAndUpdate({ _id: new ObjectId(typeId) }, { isHidden: true })
    return {
      success: true,
      code: HTTP_STATUS.OK,
      message: typeMessages.TYPE_HIDDEN_SUCCESS
    }
  }
  async checkTypeExist(name: string): Promise<boolean> {
    const type = await Type.findOne({ name })
    return Boolean(type)
  }
  async checkIdTypeExist(id: string): Promise<boolean> {
    const typeId = await Type.findOne({ _id: new ObjectId(id) })
    return Boolean(typeId)
  }
  async getAllType(): Promise<IResponseMessage<InstanceType<typeof Type>[]>> {
    const listType = await Type.find({})
    return {
      success: true,
      code: HTTP_STATUS.OK,
      message: typeMessages.GET_ALL_TYPE_SUCCESS,
      data: listType
    }
  }
}

const typeService = new TypeService()
export default typeService
