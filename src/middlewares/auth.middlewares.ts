import { NextFunction, RequestHandler, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import { ErrorWithStatus } from '~/common/Errors'
import { client } from '~/config/connectRedis'
import { INVITE_SECRET_KEY, JWT_SECRET_ACCESS_TOKEN, JWT_SECRET_REFRESH_TOKEN } from '~/config/env-config'
import { EUserRole, EUserStatus } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { authMessages } from '~/constants/messages'
import { InviteId, RefreshToken, User } from '~/models/schemas'
import { authService } from '~/services'
import { hashPassword } from '~/utils/crypto'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validation'

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
      },
      inviteId: {
        notEmpty: {
          errorMessage: authMessages.INVITE_ID_IS_REQUIRED
        },
        custom: {
          options: async (value, { req }) => {
            const invite = await InviteId.findOne({ code: value })
            if (!invite) {
              throw new Error(authMessages.INVITE_ID_NOT_FOUND)
            }
            if (invite.status === EUserStatus.INACTIVE) {
              throw new Error(authMessages.INVITE_ID_IS_INACTIVE)
            }
            try {
              const decodedTokenInvite = await verifyToken({
                token: value,
                secretOnPublicKey: INVITE_SECRET_KEY as string
              })
              req.decodedTokenInvite = decodedTokenInvite
            } catch (error) {
              throw new ErrorWithStatus({
                success: false,
                code: HTTP_STATUS.NOT_FOUND,
                message: (error as JsonWebTokenError).message
              })
            }
            return true
          }
        }
      },
      dateOfBirth: {
        notEmpty: {
          errorMessage: authMessages.DATE_OF_BIRTH_IS_REQUIRED
        },
        isISO8601: {
          options: {
            strict: true,
            strictSeparator: true
          },
          errorMessage: authMessages.DATE_OF_BIRTH_MUST_BE_ISO8601
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
            if (user.status === EUserStatus.INACTIVE) {
              throw new Error(authMessages.YOUR_ACCOUNT_IS_CURRENTLY_INACTIVE)
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
            const data = await client.get(`user_${accessToken}`)
            if (!data) {
              throw new ErrorWithStatus({
                success: false,
                code: HTTP_STATUS.UNAUTHORIZED,
                message: authMessages.FORBIDDEN_ACCESS_DENIED
              })
            }
            try {
              const decodedAuthorization = await verifyToken({
                token: accessToken,
                secretOnPublicKey: JWT_SECRET_ACCESS_TOKEN as string
              })
              req.decodedAuthorization = decodedAuthorization
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
              const [decodedRefreshToken, refreshToken] = await Promise.all([
                verifyToken({ token: value, secretOnPublicKey: JWT_SECRET_REFRESH_TOKEN as string }),
                RefreshToken.findOne({ token: value })
              ])
              if (refreshToken == null) {
                throw new ErrorWithStatus({
                  success: false,
                  code: HTTP_STATUS.UNAUTHORIZED,
                  message: authMessages.USED_REFRESH_TOKEN_OR_NOT_EXIST
                })
              }
              req.decodedRefreshToken = decodedRefreshToken
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
export const checkAuthValidator: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  try {
    const userRole = req.decodedAuthorization?.role
    if (userRole !== EUserRole.ADMIN) {
      return res
        .status(HTTP_STATUS.FORBIDDEN)
        .json({ success: false, code: HTTP_STATUS.FORBIDDEN, message: authMessages.FORBIDDEN_ACCESS_DENIED })
    }
    next()
  } catch (error) {
    const err: Error = error as Error
    throw new Error(err.message)
  }
}
