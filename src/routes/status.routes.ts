import { Router } from 'express'
import { statusController } from '~/controllers'
import {
  accessTokenValidator,
  checkAuthValidator,
  checkStatusIdValidator,
  createStatusValidator,
  updateStatusValidator
} from '~/middlewares'
const statusRouter = Router()

statusRouter.post('/', accessTokenValidator, checkAuthValidator, createStatusValidator, statusController.create)
statusRouter.get('/', accessTokenValidator, checkAuthValidator, statusController.getAllStatus)
statusRouter.put(
  '/:statusId',
  accessTokenValidator,
  checkAuthValidator,
  checkStatusIdValidator,
  updateStatusValidator,
  statusController.update
)
statusRouter.put(
  '/:statusId/hide',
  accessTokenValidator,
  checkAuthValidator,
  checkStatusIdValidator,
  statusController.hiddenStatus
)

export { statusRouter }
