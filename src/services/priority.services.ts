import { ObjectId } from 'mongodb'
import { IPriorityReqBody } from '~/interfaces/requests/Priority.requests'
import Priority from '~/models/schemas/Priority.schemas'

class PriorityService {
  async createPriority(payload: IPriorityReqBody): Promise<InstanceType<typeof Priority>> {
    const newPriority = new Priority({
      ...payload
    })
    await newPriority.save()
    return newPriority
  }
  async updatePriority(payload: IPriorityReqBody, priorityId: string): Promise<InstanceType<typeof Priority>> {
    const updatePriority = await Priority.findByIdAndUpdate(
      { _id: new ObjectId(priorityId) },
      { ...payload },
      { new: true }
    )
    return updatePriority as InstanceType<typeof Priority>
  }
  async hiddenPriority(priorityId: string): Promise<InstanceType<typeof Priority>> {
    return (await Priority.findByIdAndUpdate({ _id: new ObjectId(priorityId) }, { isHidden: true })) as InstanceType<
      typeof Priority
    >
  }
  async checkPriorityExist(name: string): Promise<boolean> {
    const priority = await Priority.findOne({ name })
    return Boolean(priority)
  }
  async checkIdPriorityExist(id: string): Promise<boolean> {
    const priorityId = await Priority.findOne({ _id: new ObjectId(id) })
    return Boolean(priorityId)
  }
  async getAllPriority(): Promise<InstanceType<typeof Priority>[]> {
    const listPriority = await Priority.find({}).sort({ order: 1 })
    return listPriority
  }
}

const priorityService = new PriorityService()
export default priorityService
