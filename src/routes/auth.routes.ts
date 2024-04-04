import { Router } from 'express'
import authController from '~/controllers/auth.controllers'
import {
  accessTokenValidator,
  loginValidate,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/auth.middlewares'

const authRouter = Router()
//Auth router
authRouter.post('/register', registerValidator, authController.register)
authRouter.post('/login', loginValidate, authController.login)
authRouter.post('/logout', refreshTokenValidator, accessTokenValidator, authController.logout)
authRouter.post('/refresh-token', refreshTokenValidator, authController.refreshToken)

export default authRouter
