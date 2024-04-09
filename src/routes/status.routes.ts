import { Router } from 'express'
import statusController from '~/controllers/status.controllers'
import { accessTokenValidator, checkAuthValidator } from '~/middlewares/auth.middlewares'
import { checkStatusIdValidator, createStatusValidator, updateStatusValidator } from '~/middlewares/status.middlewares'
const statusRouter = Router()

statusRouter.post('/', accessTokenValidator, checkAuthValidator, createStatusValidator, statusController.create)
statusRouter.get('/', accessTokenValidator, checkAuthValidator, statusController.getAllStatus)
statusRouter.put('/:statusId', accessTokenValidator, checkAuthValidator, updateStatusValidator, statusController.update)
statusRouter.put(
  '/:statusId/hide',
  accessTokenValidator,
  checkAuthValidator,
  checkStatusIdValidator,
  statusController.hiddenStatus
)
export default statusRouter
