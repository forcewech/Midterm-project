import { config } from 'dotenv'
import { checkSchema } from 'express-validator'
import HTTP_STATUS from '~/constants/httpStatus'
import { authMessages } from '~/constants/messages/auth.messages'
import { ErrorWithStatus } from '~/common/Errors'
import RefreshToken from '~/models/schemas/RefreshToken.schemas'
import User from '~/models/schemas/User.schemas'
import authService from '~/services/auth.services'
import { hashPassword } from '~/utils/crypto'
import { validate } from '~/utils/validation'
import { verifyToken } from '~/utils/jwt'
import { JsonWebTokenError } from 'jsonwebtoken'
config()
export const registerValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: authMessages.NAME_IS_REQUIRED
        },
        isString: {
          errorMessage: authMessages.NAME_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 1,
            max: 100
          },
          errorMessage: authMessages.NAME_LENGTH_MUST_BE_FROM_1_TO_100
        },
        trim: true
      },
      email: {
        notEmpty: {
          errorMessage: authMessages.EMAIL_IS_REQUIRED
        },
        isEmail: {
          errorMessage: authMessages.EMAIL_IS_INVALID
        }
      },
      userName: {
        notEmpty: {
          errorMessage: authMessages.USERNAME_IS_REQUIRED
        },
        trim: true,
        custom: {
          options: async (value) => {
            const isExistUserName = await authService.checkUserNameExist(value)
            if (isExistUserName) {
              throw new Error(authMessages.USERNAME_ALREADY_EXISTS)
            }
            return true
          }
        }
      },
      password: {
        notEmpty: {
          errorMessage: authMessages.PASSWORD_IS_REQUIRED
        },
        isString: {
          errorMessage: authMessages.PASSWORD_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 6,
            max: 50
          },
          errorMessage: authMessages.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
        },
        isStrongPassword: {
          options: {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
          },
          errorMessage: authMessages.PASSWORD_MUST_BE_STRONG
        }
      }
    },
    ['body']
  )
)

export const loginValidate = validate(
  checkSchema(
    {
      userName: {
        notEmpty: {
          errorMessage: authMessages.USERNAME_IS_REQUIRED
        },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const user = await User.findOne({ userName: value, password: hashPassword(req.body.password) })
            if (user == null) {
              throw new Error(authMessages.USERNAME_OR_PASSWORD_IS_INCORRECT)
            }
            req.user = user
            return true
          }
        }
      },
      password: {
        notEmpty: {
          errorMessage: authMessages.PASSWORD_IS_REQUIRED
        },
        isString: {
          errorMessage: authMessages.PASSWORD_MUST_BE_A_STRING
        }
      }
    },
    ['body']
  )
)
export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        custom: {
          options: async (value: string, { req }) => {
            const accessToken = (value || '').split(' ')[1]
            if (!accessToken) {
              throw new ErrorWithStatus({
                success: false,
                code: HTTP_STATUS.UNAUTHORIZED,
                message: authMessages.ACCESS_TOKEN_IS_REQUIRED
              })
            }
            try {
              const decoded_authorization = await verifyToken({
                token: accessToken,
                secretOnPublicKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
              })
              req.decoded_authorization = decoded_authorization
            } catch (error) {
              throw new ErrorWithStatus({
                success: false,
                code: HTTP_STATUS.UNAUTHORIZED,
                message: (error as JsonWebTokenError).message
              })
            }
            return true
          }
        }
      }
    },
    ['headers']
  )
)
export const refreshTokenValidator = validate(
  checkSchema(
    {
      refreshToken: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                success: false,
                code: HTTP_STATUS.UNAUTHORIZED,
                message: authMessages.REFRESH_TOKEN_IS_REQUIRED
              })
            }
            const refreshToken = await RefreshToken.findOne({ token: value })
            if (refreshToken == null) {
              throw new ErrorWithStatus({
                success: false,
                code: HTTP_STATUS.UNAUTHORIZED,
                message: authMessages.USED_REFRESH_TOKEN_OR_NOT_EXIST
              })
            }
            try {
              const [decoded_refresh_token, refresh_token] = await Promise.all([
                verifyToken({ token: value, secretOnPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string }),
                RefreshToken.findOne({ token: value })
              ])
              if (refresh_token == null) {
                throw new ErrorWithStatus({
                  success: false,
                  code: HTTP_STATUS.UNAUTHORIZED,
                  message: authMessages.USED_REFRESH_TOKEN_OR_NOT_EXIST
                })
              }
              req.decoded_refresh_token = decoded_refresh_token
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  success: false,
                  code: HTTP_STATUS.UNAUTHORIZED,
                  message: error.message
                })
              }
              throw error
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)
