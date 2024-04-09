import { Router } from 'express'
import priorityController from '~/controllers/priority.controllers'
import { accessTokenValidator, checkAuthValidator } from '~/middlewares/auth.middlewares'
import {
  checkPriorityIdValidator,
  createPriorityValidator,
  updatePriorityValidator
} from '~/middlewares/priority.middlewares'
const priorityRouter = Router()

priorityRouter.post('/', accessTokenValidator, checkAuthValidator, createPriorityValidator, priorityController.create)
priorityRouter.get('/', accessTokenValidator, checkAuthValidator, priorityController.getAllPriority)
priorityRouter.put(
  '/:priorityId',
  accessTokenValidator,
  checkAuthValidator,
  updatePriorityValidator,
  priorityController.update
)
priorityRouter.put(
  '/:priorityId/hide',
  accessTokenValidator,
  checkAuthValidator,
  checkPriorityIdValidator,
  priorityController.hiddenPriority
)
export default priorityRouter
