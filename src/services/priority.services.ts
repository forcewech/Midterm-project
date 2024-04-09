import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { priorityMessages } from '~/constants/messages/priority.messages'
import { IResponseMessage } from '~/interfaces/reponses/response'
import { IPriorityReqBody } from '~/interfaces/requests/Priority.requests'
import Priority from '~/models/schemas/Priority.schemas'

class PriorityService {
  async createPriority(payload: IPriorityReqBody): Promise<IResponseMessage<InstanceType<typeof Priority>>> {
    const newPriority = new Priority({
      ...payload
    })
    await newPriority.save()
    return {
      success: true,
      code: HTTP_STATUS.CREATED,
      message: priorityMessages.CREATE_PRIORITY_SUCCESS,
      data: newPriority
    }
  }
  async updatePriority(
    payload: IPriorityReqBody,
    priorityId: string
  ): Promise<IResponseMessage<InstanceType<typeof Priority>>> {
    const updatePriority = await Priority.findByIdAndUpdate(
      { _id: new ObjectId(priorityId) },
      { ...payload },
      { new: true }
    )
    return {
      success: true,
      code: HTTP_STATUS.OK,
      message: priorityMessages.UPDATE_PRIORITY_SUCCESS,
      data: updatePriority as InstanceType<typeof Priority>
    }
  }
  async hiddenPriority(priorityId: string): Promise<IResponseMessage<InstanceType<typeof Priority>>> {
    await Priority.findByIdAndUpdate({ _id: new ObjectId(priorityId) }, { isHidden: true })
    return {
      success: true,
      code: HTTP_STATUS.OK,
      message: priorityMessages.PRIORITY_HIDDEN_SUCCESS
    }
  }
  async checkPriorityExist(name: string): Promise<boolean> {
    const priority = await Priority.findOne({ name })
    return Boolean(priority)
  }
  async checkIdPriorityExist(id: string): Promise<boolean> {
    const priorityId = await Priority.findOne({ _id: new ObjectId(id) })
    return Boolean(priorityId)
  }
  async getAllPriority(): Promise<IResponseMessage<InstanceType<typeof Priority>[]>> {
    const listPriority = await Priority.find({}).sort({ order: 1 })
    return {
      success: true,
      code: HTTP_STATUS.OK,
      message: priorityMessages.GET_ALL_PRIORITY_SUCCESS,
      data: listPriority
    }
  }
}

const priorityService = new PriorityService()
export default priorityService
