import { Router } from 'express'
import taskController from '~/controllers/task.controllers'
import { accessTokenValidator, checkAuthValidator } from '~/middlewares/auth.middlewares'
import {
  dateInProjectValidator,
  checkTaskIdValidator,
  getAllTaskValidator,
  checkUsersInProject,
  createTaskValidator,
  updateTaskValidator
} from '~/middlewares/task.middlewares'
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
export default taskRouter