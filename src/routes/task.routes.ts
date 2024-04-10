import { Router } from 'express'
import { taskController } from '~/controllers'
import {
  accessTokenValidator,
  checkAuthValidator,
  checkTaskIdValidator,
  checkUsersInProject,
  createTaskValidator,
  dateInProjectValidator,
  getAllTaskValidator,
  updateTaskValidator
} from '~/middlewares'
const taskRouter = Router()

taskRouter.post(
  '/',
  accessTokenValidator,
  checkAuthValidator,
  createTaskValidator,
  checkUsersInProject,
  dateInProjectValidator,
  taskController.create
)
taskRouter.put(
  '/:taskId',
  accessTokenValidator,
  checkAuthValidator,
  updateTaskValidator,
  checkTaskIdValidator,
  checkUsersInProject,
  dateInProjectValidator,
  taskController.update
)
taskRouter.delete('/:taskId', accessTokenValidator, checkAuthValidator, checkTaskIdValidator, taskController.delete)
taskRouter.get('/', accessTokenValidator, checkAuthValidator, getAllTaskValidator, taskController.getAllTask)

export { taskRouter }
