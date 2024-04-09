import { ObjectId } from 'mongodb'
import { ITypeReqBody } from '~/interfaces/requests/Type.requests'
import Type from '~/models/schemas/Type.schemas'

class TypeService {
  async createType(payload: ITypeReqBody): Promise<InstanceType<typeof Type>> {
    const newType = new Type({
      ...payload
    })
    await newType.save()
    return newType
  }
  async updateType(payload: ITypeReqBody, typeId: string): Promise<InstanceType<typeof Type>> {
    const updateType = await Type.findByIdAndUpdate({ _id: new ObjectId(typeId) }, { ...payload }, { new: true })
    return updateType as InstanceType<typeof Type>
  }
  async hiddenType(typeId: string): Promise<InstanceType<typeof Type>> {
    return (await Type.findByIdAndUpdate({ _id: new ObjectId(typeId) }, { isHidden: true })) as InstanceType<
      typeof Type
    >
  }
  async checkTypeExist(name: string): Promise<boolean> {
    const type = await Type.findOne({ name })
    return Boolean(type)
  }
  async checkIdTypeExist(id: string): Promise<boolean> {
    const typeId = await Type.findOne({ _id: new ObjectId(id) })
    return Boolean(typeId)
  }
  async getAllType(): Promise<InstanceType<typeof Type>[]> {
    const listType = await Type.find({})
    return listType
  }
}

const typeService = new TypeService()
export default typeService
