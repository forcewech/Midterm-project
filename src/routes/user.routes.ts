import { Router } from 'express'
import userController from '~/controllers/user.controllers'
import { accessTokenValidator, checkAuthValidator } from '~/middlewares/auth.middlewares'
import { checkUserIdValidator } from '~/middlewares/user.middlewares'
const userRouter = Router()

userRouter.post('/inviteId', accessTokenValidator, checkAuthValidator, userController.createInviteId)
userRouter.get('/', accessTokenValidator, checkAuthValidator, userController.getAllUser)
userRouter.get('/:userId', accessTokenValidator, checkAuthValidator, checkUserIdValidator, userController.getUser)
userRouter.delete('/:userId', accessTokenValidator, checkAuthValidator, checkUserIdValidator, userController.delete)
userRouter.put('/:userId', accessTokenValidator, checkAuthValidator, checkUserIdValidator, userController.update)
export default userRouter
