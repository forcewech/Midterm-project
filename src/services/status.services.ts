import { ObjectId } from 'mongodb'
import { ENameStatus } from '~/constants/enums'
import { IStatusReqBody, IUpdateStatus } from '~/interfaces/requests'
import { Status } from '~/models/schemas'

class StatusService {
  async createStatus(payload: IStatusReqBody): Promise<InstanceType<typeof Status>> {
    const newStatus = new Status({
      ...payload
    })
    const statusNew = await Status.findOne({ name: ENameStatus.NEW })
    const statusClosed = await Status.findOne({ name: ENameStatus.CLOSED })
    if (statusNew?.order) {
      if (Number(payload.order) <= statusNew?.order) {
        statusNew.order = Number(payload.order) - 1
        await statusNew.save()
      }
    }
    if (statusClosed?.order) {
      if (Number(payload.order) >= statusClosed?.order) {
        statusClosed.order = Number(payload.order) + 1
        await statusClosed.save()
      }
    }
    await newStatus.save()
    return newStatus
  }
  async updateStatus(payload: IUpdateStatus, statusId: string): Promise<InstanceType<typeof Status>> {
    const updateStatus = await Status.findByIdAndUpdate({ _id: new ObjectId(statusId) }, { ...payload }, { new: true })
    if (payload.order) {
      const statusNew = await Status.findOne({ name: ENameStatus.NEW })
      const statusClosed = await Status.findOne({ name: ENameStatus.CLOSED })
      if (statusNew?.order && statusNew._id.toString() !== statusId) {
        if (Number(payload.order) <= statusNew?.order) {
          statusNew.order = Number(payload.order) - 1
          await statusNew.save()
        }
      }
      if (statusClosed?.order && statusClosed._id.toString() !== statusId) {
        if (Number(payload.order) >= statusClosed?.order) {
          statusClosed.order = Number(payload.order) + 1
          await statusClosed.save()
        }
      }
    }
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
export { statusService }
