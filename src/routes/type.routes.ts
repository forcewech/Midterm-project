import { Router } from 'express'
import typeController from '~/controllers/type.controllers'
import { accessTokenValidator, checkAuthValidator } from '~/middlewares/auth.middlewares'
import { checkTypeIdValidator, createTypeValidator, updateTypeValidator } from '~/middlewares/type.middlewares'
const typeRouter = Router()

typeRouter.post('/', accessTokenValidator, checkAuthValidator, createTypeValidator, typeController.create)
typeRouter.get('/', accessTokenValidator, checkAuthValidator, updateTypeValidator, typeController.getAllType)
typeRouter.put('/:typeId', accessTokenValidator, checkAuthValidator, checkTypeIdValidator, typeController.update)
typeRouter.put(
  '/:typeId/hide',
  accessTokenValidator,
  checkAuthValidator,
  checkTypeIdValidator,
  typeController.hiddenType
)
export default typeRouter
