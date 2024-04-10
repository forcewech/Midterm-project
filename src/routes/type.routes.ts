import { Router } from 'express'
import { typeController } from '~/controllers'
import {
  accessTokenValidator,
  checkAuthValidator,
  checkTypeIdValidator,
  createTypeValidator,
  updateTypeValidator
} from '~/middlewares'
const typeRouter = Router()

typeRouter.post('/', accessTokenValidator, checkAuthValidator, createTypeValidator, typeController.create)
typeRouter.get('/', accessTokenValidator, checkAuthValidator, typeController.getAllType)
typeRouter.put('/:typeId', accessTokenValidator, checkAuthValidator, updateTypeValidator, typeController.update)
typeRouter.put(
  '/:typeId/hide',
  accessTokenValidator,
  checkAuthValidator,
  checkTypeIdValidator,
  typeController.hiddenType
)

export { typeRouter }
