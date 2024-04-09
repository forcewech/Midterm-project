import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { defaultLimit, defaultPage } from '~/constants/constant'
import HTTP_STATUS from '~/constants/httpStatus'
import { IResponseMessage } from '~/interfaces/reponses/response'
import { ITaskReqBody } from '~/interfaces/requests/Task.requests'
import Task from '~/models/schemas/Task.schemas'
import taskService from '~/services/task.services'

class TaskController {
  async create(
    req: Request<ParamsDictionary, any, ITaskReqBody>,
    res: Response
  ): Promise<Response<IResponseMessage<typeof Task>>> {
    try {
      const meId = req.decodedAuthorization?.userId as string
      const result = await taskService.createTask(req.body, meId)
      return res.status(HTTP_STATUS.CREATED).json(result)
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
  async update(
    req: Request<ParamsDictionary, any, ITaskReqBody>,
    res: Response
  ): Promise<Response<IResponseMessage<typeof Task>>> {
    try {
      const taskId = req.params.taskId
      const result = await taskService.updateTask(req.body, taskId)
      return res.json(result)
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
  async delete(req: Request, res: Response): Promise<Response<IResponseMessage<typeof Task>>> {
    try {
      const taskId = req.params.taskId
      const result = await taskService.deleteTaskById(taskId)
      return res.json(result)
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
  async getAllTask(req: Request, res: Response): Promise<Response<IResponseMessage<typeof Task>[]>> {
    try {
      const page = parseInt(req.query.page as string) || defaultPage
      const pageSize = parseInt(req.query.limit as string) || defaultLimit
      const result = await taskService.getAllTask(page, pageSize)
      return res.json(result)
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
}

const taskController = new TaskController()
export default taskController
