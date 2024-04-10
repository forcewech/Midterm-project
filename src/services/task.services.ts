import { ObjectId } from 'mongodb'
import { IResponseMessage } from '~/interfaces/reponses/response'
import { ITaskReqBody } from '~/interfaces/requests'
import { Project, Task } from '~/models/schemas'

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
  async deleteTaskById(taskId: string): Promise<void> {
    await Task.findByIdAndDelete({ _id: new ObjectId(taskId) })
    await Project.updateOne({ tasks: taskId }, { $pull: { tasks: new ObjectId(taskId) } })
  }
  async getAllTask(
    page: number,
    pageSize: number,
    statusId: string
  ): Promise<IResponseMessage<InstanceType<typeof Task>[]>> {
    const totalTasks = await Task.aggregate([
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
          }
        }
      },
      {
        $match: {
          'status._id': new ObjectId(statusId)
        }
      },
      {
        $count: 'total'
      }
    ])
    const getTotalTasks = statusId ? totalTasks[0].total : await Task.countDocuments({})
    const totalPage = Math.ceil(getTotalTasks / pageSize)
    const skip = (page - 1) * pageSize
    const getAllDataWithPaginate = statusId
      ? await Task.aggregate([
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
              'status._id': new ObjectId(statusId)
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
      : await Task.find({}).skip(skip).limit(pageSize)
    return {
      data: getAllDataWithPaginate,
      totalItems: getTotalTasks,
      totalPage,
      currentPage: page
    }
  }
  async getMytasks(
    page: number,
    pageSize: number,
    userId: string
  ): Promise<IResponseMessage<InstanceType<typeof Task>[]>> {
    const totalItems = await Task.countDocuments({ assignedTo: new ObjectId(userId) })
    const totalPage = Math.ceil(totalItems / pageSize)
    const skip = (page - 1) * pageSize
    const myTasks = await Task.find({ assignedTo: new ObjectId(userId) })
      .skip(skip)
      .limit(pageSize)
    return {
      data: myTasks,
      totalItems,
      totalPage,
      currentPage: page
    }
  }
}

const taskService = new TaskService()
export { taskService }
