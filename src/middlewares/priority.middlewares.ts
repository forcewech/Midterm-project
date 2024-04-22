import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import { priorityMessages } from '~/constants/messages'
import { priorityService } from '~/services'
import { validate } from '~/utils/validation'

export const createPriorityValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: priorityMessages.NAME_IS_REQUIRED
        },
        isString: {
          errorMessage: priorityMessages.NAME_MUST_BE_A_STRING
        },
        isLength: {
          options: { max: 50 },
          errorMessage: priorityMessages.NAME_SHOULD_NOT_EXCEED_50_CHARACTERS
        },
        custom: {
          options: async (value) => {
            const isExistPriority = await priorityService.checkPriorityExist(value)
            if (isExistPriority) {
              throw new Error(priorityMessages.NAME_PRIORITY_ALREADY_EXISTS)
            }
            return true
          }
        }
      },
      order: {
        notEmpty: {
          errorMessage: priorityMessages.ORDER_IS_REQUIRED
        },
        custom: {
          options: async (value) => {
            const regex = /^\d+$/
            if (!regex.test(value)) {
              throw new Error(priorityMessages.ORDER_IS_INVALID)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)
export const updatePriorityValidator = validate(
  checkSchema(
    {
      name: {
        optional: true,
        isLength: {
          options: { max: 50 },
          errorMessage: priorityMessages.NAME_SHOULD_NOT_EXCEED_50_CHARACTERS
        },
        custom: {
          options: async (value) => {
            const isExistPriority = await priorityService.checkPriorityExist(value)
            if (isExistPriority) {
              throw new Error(priorityMessages.NAME_PRIORITY_ALREADY_EXISTS)
            }
            return true
          }
        }
      },
      order: {
        optional: true,
        custom: {
          options: async (value) => {
            if (value) {
              const regex = /^\d+$/
              if (!regex.test(value)) {
                throw new Error(priorityMessages.ORDER_IS_INVALID)
              }
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)
export const checkPriorityIdValidator = validate(
  checkSchema(
    {
      priorityId: {
        custom: {
          options: async (value) => {
            if (!ObjectId.isValid(value)) {
              throw new Error(priorityMessages.PRIORITY_ID_IS_INVALID)
            }
            const isIdPriority = await priorityService.checkIdPriorityExist(value)
            if (!isIdPriority) {
              throw new Error(priorityMessages.PRIORITY_NOT_FOUND)
            }
            return true
          }
        }
      }
    },
    ['params']
  )
)
