import { ObjectId } from 'mongodb'
import { IResponseMessage } from '~/interfaces/reponses/response'
import { ITaskReqBody } from '~/interfaces/requests/Task.requests'
import Project from '~/models/schemas/Project.schemas'
import Task from '~/models/schemas/Task.schemas'

class TaskService {
  async createTask(payload: ITaskReqBody, userId: string, defaultNew: string): Promise<InstanceType<typeof Task>> {
    const newTask = new Task({
      ...payload,
      project: payload.projectId,
      type: payload.typeId,
      status: payload.statusId ?? defaultNew,
      priority: payload.priorityId,
      assignedTo: payload.assignedTo ?? userId
    })
    await newTask.save()
    await Project.findByIdAndUpdate({ _id: payload.projectId }, { $push: { tasks: newTask._id } }, { new: true })
    return newTask
  }
  async checkTaskExist(name: string): Promise<boolean> {
    const task = await Task.findOne({ name })
    return Boolean(task)
  }
  async checkIdTaskExist(id: string): Promise<boolean> {
    const taskId = await Task.findOne({ _id: new ObjectId(id) })
    return Boolean(taskId)
  }
  async updateTask(payload: ITaskReqBody, taskId: string): Promise<InstanceType<typeof Task>> {
    const updateTaskData = await Task.findByIdAndUpdate({ _id: new ObjectId(taskId) }, { ...payload }, { new: true })
    return updateTaskData as InstanceType<typeof Task>
  }
  async deleteTaskById(taskId: string): Promise<InstanceType<typeof Task>> {
    return (await Task.findByIdAndDelete({ _id: new ObjectId(taskId) })) as InstanceType<typeof Task>
  }
  async getAllTask(
    page: number,
    pageSize: number,
    status: string
  ): Promise<IResponseMessage<InstanceType<typeof Task>[]>> {
    const totalItems = await Task.countDocuments({})
    const totalPage = Math.ceil(totalItems / pageSize)
    const skip = (page - 1) * pageSize
    const getAllDataWithPaginate = await Task.aggregate([
      {
        $lookup: {
          from: 'status',
          localField: 'status',
          foreignField: '_id',
          as: 'status'
        }
      },
      {
        $lookup: {
          from: 'priorities',
          localField: 'priority',
          foreignField: '_id',
          as: 'priority'
        }
      },
      {
        $set: {
          status: {
            $arrayElemAt: ['$status', 0]
          },
          priority: {
            $arrayElemAt: ['$priority', 0]
          }
        }
      },
      {
        $match: {
          'status.name': status
        }
      },
      {
        $sort: {
          'priority.order': 1
        }
      },
      {
        $skip: skip
      },
      {
        $limit: pageSize
      }
    ])
    return {
      data: getAllDataWithPaginate,
      totalItems,
      totalPage,
      currentPage: page
    }
  }
}
const taskService = new TaskService()
export default taskService
