import { ObjectId } from 'mongodb'
import { statusNewId } from '~/constants/constant'
import HTTP_STATUS from '~/constants/httpStatus'
import { taskMessages } from '~/constants/messages/task.messages'
import { IResponseMessage } from '~/interfaces/reponses/response'
import { ITaskReqBody } from '~/interfaces/requests/Task.requests'
import Project from '~/models/schemas/Project.schemas'
import Task from '~/models/schemas/Task.schemas'

class TaskService {
  async createTask(payload: ITaskReqBody, userId: string): Promise<IResponseMessage<InstanceType<typeof Task>>> {
    const newTask = new Task({
      ...payload,
      project: payload.projectId,
      type: payload.typeId,
      status: payload.statusId ?? statusNewId,
      priority: payload.priorityId,
      assignedTo: payload.assignedTo ?? userId
    })
    await newTask.save()
    await Project.findByIdAndUpdate({ _id: payload.projectId }, { $push: { tasks: newTask._id } }, { new: true })
    return {
      success: true,
      code: HTTP_STATUS.CREATED,
      message: taskMessages.CREATE_TASK_SUCCESS,
      data: newTask
    }
  }
  async checkTaskExist(name: string): Promise<boolean> {
    const task = await Task.findOne({ name })
    return Boolean(task)
  }
  async checkIdTaskExist(id: string): Promise<boolean> {
    const taskId = await Task.findOne({ _id: new ObjectId(id) })
    return Boolean(taskId)
  }
  async updateTask(payload: ITaskReqBody, taskId: string): Promise<IResponseMessage<InstanceType<typeof Task>>> {
    const updateTaskData = await Task.findByIdAndUpdate({ _id: new ObjectId(taskId) }, { ...payload }, { new: true })
    return {
      success: true,
      code: HTTP_STATUS.OK,
      message: taskMessages.UPDATE_TASK_SUCCESS,
      data: updateTaskData as InstanceType<typeof Task>
    }
  }
  async deleteTaskById(taskId: string): Promise<IResponseMessage<InstanceType<typeof Task>>> {
    await Task.findByIdAndDelete({ _id: new ObjectId(taskId) })
    return {
      success: true,
      code: HTTP_STATUS.OK,
      message: taskMessages.DELETE_TASK_SUCCESS
    }
  }
  async getAllTask(page: number, pageSize: number): Promise<IResponseMessage<InstanceType<typeof Task>[]>> {
    const totalItems = await Project.countDocuments({})
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
          from: 'users',
          localField: 'assignedTo',
          foreignField: '_id',
          as: 'assignedTo'
        }
      },
      {
        $lookup: {
          from: 'projects',
          localField: 'project',
          foreignField: '_id',
          as: 'project'
        }
      },
      {
        $lookup: {
          from: 'types',
          localField: 'type',
          foreignField: '_id',
          as: 'type'
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
        $unwind: {
          path: '$status',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: '$assignedTo',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: '$project',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: '$type',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: '$priority',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: '$status',
          tasks: {
            $push: '$$ROOT'
          }
        }
      },
      {
        $project: {
          _id: 0
        }
      },
      {
        $unwind: {
          path: '$tasks',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ['$tasks', '$$ROOT']
          }
        }
      },
      {
        $project: {
          tasks: 0
        }
      },
      {
        $sort: {
          priority: 1
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
      success: true,
      code: HTTP_STATUS.OK,
      message: taskMessages.GET_ALL_TASK_WITH_PAGINATE_SUCCESS,
      data: getAllDataWithPaginate,
      totalItems,
      totalPage,
      currentPage: page
    }
  }
}
const taskService = new TaskService()
export default taskService
