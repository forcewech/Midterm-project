import { Router } from 'express'
import { priorityController } from '~/controllers'
import {
  accessTokenValidator,
  checkAuthValidator,
  checkPriorityIdValidator,
  createPriorityValidator,
  updatePriorityValidator
} from '~/middlewares'
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

export { priorityRouter }
