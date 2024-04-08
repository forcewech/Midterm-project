import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import { typeMessages } from '~/constants/messages/type.messages'
import typeService from '~/services/type.services'
import { validate } from '~/utils/validation'

export const createTypeValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: typeMessages.NAME_IS_REQUIRED
        },
        isString: {
          errorMessage: typeMessages.NAME_MUST_BE_A_STRING
        },
        custom: {
          options: async (value) => {
            const isExistType = await typeService.checkTypeExist(value)
            if (isExistType) {
              throw new Error(typeMessages.NAME_TYPE_ALREADY_EXISTS)
            }
            return true
          }
        }
      },
      color: {
        notEmpty: {
          errorMessage: typeMessages.COLOR_IS_REQUIRED
        },
        isString: {
          errorMessage: typeMessages.COLOR_MUST_BE_A_STRING
        }
      }
    },
    ['body']
  )
)
export const updateTypeValidator = validate(
  checkSchema(
    {
      name: {
        isString: {
          errorMessage: typeMessages.NAME_MUST_BE_A_STRING
        },
        custom: {
          options: async (value) => {
            if (value) {
              const isExistType = await typeService.checkTypeExist(value)
              if (isExistType) {
                throw new Error(typeMessages.NAME_TYPE_ALREADY_EXISTS)
              }
            }
            return true
          }
        }
      },
      color: {
        isString: {
          errorMessage: typeMessages.COLOR_MUST_BE_A_STRING
        }
      }
    },
    ['body']
  )
)
export const checkTypeIdValidator = validate(
  checkSchema(
    {
      typeId: {
        custom: {
          options: async (value) => {
            if (!ObjectId.isValid(value)) {
              throw new Error(typeMessages.TYPE_ID_IS_INVALID)
            }
            const isIdType = await typeService.checkIdTypeExist(value)
            if (!isIdType) {
              throw new Error(typeMessages.TYPE_NOT_FOUND)
            }
            return true
          }
        }
      }
    },
    ['params']
  )
)
