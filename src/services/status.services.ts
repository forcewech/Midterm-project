import { ObjectId } from 'mongodb'
import { IStatusReqBody } from '~/interfaces/requests/Status.requests'
import Status from '~/models/schemas/Status.schemas'

class StatusService {
  async createStatus(payload: IStatusReqBody): Promise<InstanceType<typeof Status>> {
    const newStatus = new Status({
      ...payload
    })
    await newStatus.save()
    return newStatus
  }
  async updateStatus(payload: IStatusReqBody, statusId: string): Promise<InstanceType<typeof Status>> {
    const updateStatus = await Status.findByIdAndUpdate({ _id: new ObjectId(statusId) }, { ...payload }, { new: true })
    return updateStatus as InstanceType<typeof Status>
  }
  async hiddenStatus(statusId: string): Promise<InstanceType<typeof Status>> {
    return (await Status.findByIdAndUpdate({ _id: new ObjectId(statusId) }, { isHidden: true })) as InstanceType<
      typeof Status
    >
  }
  async checkStatusExist(name: string): Promise<boolean> {
    const status = await Status.findOne({ name })
    return Boolean(status)
  }
  async checkIdStatusExist(id: string): Promise<boolean> {
    const statusId = await Status.findOne({ _id: new ObjectId(id) })
    return Boolean(statusId)
  }
  async getAllStatus(): Promise<InstanceType<typeof Status>[]> {
    const listStatus = await Status.find({}).sort({ order: 1 })
    return listStatus
  }
}

const statusService = new StatusService()
export default statusService
