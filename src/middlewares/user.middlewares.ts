import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import { EUserStatus } from '~/constants/enums'
import { userMessages } from '~/constants/messages'
import { userService } from '~/services'
import { validate } from '~/utils/validation'

export const getAllUserValidator = validate(
  checkSchema(
    {
      page: {
        custom: {
          options: async (value) => {
            if (value) {
              const regex = /^\d+$/
              if (!regex.test(value)) {
                throw new Error(userMessages.PAGE_IS_INVALID)
              }
            }
            return true
          }
        }
      },
      limit: {
        custom: {
          options: async (value) => {
            if (value) {
              const regex = /^\d+$/
              if (!regex.test(value)) {
                throw new Error(userMessages.LIMIT_IS_INVALID)
              }
            }
            return true
          }
        }
      }
    },
    ['query']
  )
)
export const checkUserIdValidator = validate(
  checkSchema(
    {
      userId: {
        custom: {
          options: async (value) => {
            if (!ObjectId.isValid(value)) {
              throw new Error(userMessages.USER_ID_IS_INVALID)
            }
            const isIdUser = await userService.checkIdUserExist(value)
            if (!isIdUser) {
              throw new Error(userMessages.USER_NOT_FOUND)
            }
            return true
          }
        }
      }
    },
    ['params']
  )
)
export const updateUserValidator = validate(
  checkSchema(
    {
      name: {
        optional: true,
        isString: {
          errorMessage: userMessages.NAME_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 1,
            max: 100
          },
          errorMessage: userMessages.NAME_LENGTH_MUST_BE_FROM_1_TO_100
        },
        trim: true
      },
      email: {
        optional: true,
        isEmail: {
          errorMessage: userMessages.EMAIL_IS_INVALID
        }
      },
      dateOfBirth: {
        optional: true,
        isISO8601: {
          options: {
            strict: true,
            strictSeparator: true
          },
          errorMessage: userMessages.DATE_OF_BIRTH_MUST_BE_ISO8601
        }
      },
      status: {
        optional: true,
        custom: {
          options: async (value) => {
            if (value) {
              if (value !== EUserStatus.ACTIVE && value !== EUserStatus.INACTIVE) {
                throw new Error(userMessages.STATUS_IS_INVALID)
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
