import { Router } from 'express'
import { userController } from '~/controllers'
import { accessTokenValidator, checkAuthValidator, checkUserIdValidator, updateUserValidator } from '~/middlewares'
const userRouter = Router()

userRouter.post('/inviteId', accessTokenValidator, checkAuthValidator, userController.createInviteId)
userRouter.get('/', accessTokenValidator, checkAuthValidator, userController.getAllUser)
userRouter.get('/:userId', accessTokenValidator, checkAuthValidator, checkUserIdValidator, userController.getUser)
userRouter.delete('/:userId', accessTokenValidator, checkAuthValidator, checkUserIdValidator, userController.delete)
userRouter.put(
  '/:userId',
  accessTokenValidator,
  checkAuthValidator,
  checkUserIdValidator,
  updateUserValidator,
  userController.update
)

export { userRouter }
