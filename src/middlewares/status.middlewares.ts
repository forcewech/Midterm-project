import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import { statusMessages } from '~/constants/messages/status.messages'
import statusService from '~/services/status.services'
import { validate } from '~/utils/validation'

export const createStatusValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: statusMessages.NAME_IS_REQUIRED
        },
        isString: {
          errorMessage: statusMessages.NAME_MUST_BE_A_STRING
        },
        custom: {
          options: async (value) => {
            const isExistStatus = await statusService.checkStatusExist(value)
            if (isExistStatus) {
              throw new Error(statusMessages.NAME_STATUS_ALREADY_EXISTS)
            }
            return true
          }
        }
      },
      order: {
        notEmpty: {
          errorMessage: statusMessages.ORDER_IS_REQUIRED
        },
        custom: {
          options: async (value) => {
            const regex = /^\d+$/
            if (!regex.test(value)) {
              throw new Error(statusMessages.ORDER_IS_INVALID)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)
export const updateStatusValidator = validate(
  checkSchema(
    {
      name: {
        isString: {
          errorMessage: statusMessages.NAME_MUST_BE_A_STRING
        },
        custom: {
          options: async (value) => {
            if (value) {
              const isExistStatus = await statusService.checkStatusExist(value)
              if (isExistStatus) {
                throw new Error(statusMessages.NAME_STATUS_ALREADY_EXISTS)
              }
            }
            return true
          }
        }
      },
      order: {
        custom: {
          options: async (value) => {
            const regex = /^\d+$/
            if (!regex.test(value)) {
              throw new Error(statusMessages.ORDER_IS_INVALID)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)
export const checkStatusIdValidator = validate(
  checkSchema(
    {
      statusId: {
        custom: {
          options: async (value) => {
            if (!ObjectId.isValid(value)) {
              throw new Error(statusMessages.STATUS_ID_IS_INVALID)
            }
            const isIdStatus = await statusService.checkIdStatusExist(value)
            if (!isIdStatus) {
              throw new Error(statusMessages.STATUS_NOT_FOUND)
            }
            return true
          }
        }
      }
    },
    ['params']
  )
)
