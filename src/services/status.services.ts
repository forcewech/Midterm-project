import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { statusMessages } from '~/constants/messages/status.messages'
import { IResponseMessage } from '~/interfaces/reponses/response'
import { IStatusReqBody } from '~/interfaces/requests/Status.requests'
import Status from '~/models/schemas/Status.schemas'

class StatusService {
  async createStatus(payload: IStatusReqBody): Promise<IResponseMessage<InstanceType<typeof Status>>> {
    const newStatus = new Status({
      ...payload
    })
    await newStatus.save()
    return {
      success: true,
      code: HTTP_STATUS.CREATED,
      message: statusMessages.CREATE_STATUS_SUCCESS,
      data: newStatus
    }
  }
  async updateStatus(
    payload: IStatusReqBody,
    statusId: string
  ): Promise<IResponseMessage<InstanceType<typeof Status>>> {
    const updateStatus = await Status.findByIdAndUpdate({ _id: new ObjectId(statusId) }, { ...payload }, { new: true })
    return {
      success: true,
      code: HTTP_STATUS.OK,
      message: statusMessages.UPDATE_STATUS_SUCCESS,
      data: updateStatus as InstanceType<typeof Status>
    }
  }
  async hiddenStatus(statusId: string): Promise<IResponseMessage<InstanceType<typeof Status>>> {
    await Status.findByIdAndUpdate({ _id: new ObjectId(statusId) }, { isHidden: true })
    return {
      success: true,
      code: HTTP_STATUS.OK,
      message: statusMessages.STATUS_HIDDEN_SUCCESS
    }
  }
  async checkStatusExist(name: string): Promise<boolean> {
    const status = await Status.findOne({ name })
    return Boolean(status)
  }
  async checkIdStatusExist(id: string): Promise<boolean> {
    const statusId = await Status.findOne({ _id: new ObjectId(id) })
    return Boolean(statusId)
  }
  async getAllStatus(): Promise<IResponseMessage<InstanceType<typeof Status>[]>> {
    const listStatus = await Status.find({}).sort({ order: 1 })
    return {
      success: true,
      code: HTTP_STATUS.OK,
      message: statusMessages.GET_ALL_STATUS_SUCCESS,
      data: listStatus
    }
  }
}

const statusService = new StatusService()
export default statusService
