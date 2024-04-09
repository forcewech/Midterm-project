import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '~/constants/constant'
import HTTP_STATUS from '~/constants/httpStatus'
import { taskMessages } from '~/constants/messages/task.messages'
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
      const defaultNew = req.defaultNew as string
      const data = await taskService.createTask(req.body, meId, defaultNew)
      return res.status(HTTP_STATUS.CREATED).json({
        success: true,
        code: HTTP_STATUS.CREATED,
        message: taskMessages.CREATE_TASK_SUCCESS,
        data
      })
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
      const data = await taskService.updateTask(req.body, taskId)
      return res.json({
        success: true,
        code: HTTP_STATUS.OK,
        message: taskMessages.UPDATE_TASK_SUCCESS,
        data
      })
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
  async delete(req: Request, res: Response): Promise<Response<IResponseMessage<typeof Task>>> {
    try {
      const taskId = req.params.taskId
      await taskService.deleteTaskById(taskId)
      return res.json({
        success: true,
        code: HTTP_STATUS.OK,
        message: taskMessages.DELETE_TASK_SUCCESS
      })
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
  async getAllTask(req: Request, res: Response): Promise<Response<IResponseMessage<typeof Task>[]>> {
    try {
      const status = req.query.status as string
      const page = parseInt(req.query.page as string) || DEFAULT_PAGE
      const pageSize = parseInt(req.query.limit as string) || DEFAULT_LIMIT
      const data = await taskService.getAllTask(page, pageSize, status)
      return res.json({
        success: true,
        code: HTTP_STATUS.OK,
        message: taskMessages.GET_ALL_TASK_WITH_PAGINATE_SUCCESS,
        data
      })
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
}

const taskController = new TaskController()
export default taskController
