import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import { projectMessages } from '~/constants/messages/project.messages'
import projectService from '~/services/project.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { validate } from '~/utils/validation'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import { ICreateProjectReqBody } from '~/interfaces/requests/Project.requests'
import HTTP_STATUS from '~/constants/httpStatus'

export const createProjectValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: projectMessages.NAME_IS_REQUIRED
        },
        isString: {
          errorMessage: projectMessages.NAME_MUST_BE_A_STRING
        },
        custom: {
          options: async (value) => {
            const isExistProject = await projectService.checkProjectExist(value)
            if (isExistProject) {
              throw new Error(projectMessages.NAME_PROJECT_ALREADY_EXISTS)
            }
            return true
          }
        }
      },
      startDate: {
        isISO8601: {
          options: {
            strict: true,
            strictSeparator: true
          },
          errorMessage: projectMessages.START_DATE_MUST_BE_ISO8601
        },
        notEmpty: {
          errorMessage: projectMessages.START_DATE_REQUIRED
        }
      },
      endDate: {
        isISO8601: {
          options: {
            strict: true,
            strictSeparator: true
          },
          errorMessage: projectMessages.END_DATE_MUST_BE_ISO8601
        },
        notEmpty: {
          errorMessage: projectMessages.END_DATE_REQUIRED
        }
      }
    },
    ['body']
  )
)

export const updateProjectValidator = validate(
  checkSchema({
    name: {
      isString: {
        errorMessage: projectMessages.NAME_MUST_BE_A_STRING
      },
      custom: {
        options: async (value) => {
          const isExistProject = await projectService.checkProjectExist(value)
          if (isExistProject) {
            throw new Error(projectMessages.NAME_PROJECT_ALREADY_EXISTS)
          }
          return true
        }
      }
    },
    startDate: {
      isISO8601: {
        options: {
          strict: true,
          strictSeparator: true
        },
        errorMessage: projectMessages.START_DATE_MUST_BE_ISO8601
      }
    },
    endDate: {
      isISO8601: {
        options: {
          strict: true,
          strictSeparator: true
        },
        errorMessage: projectMessages.END_DATE_MUST_BE_ISO8601
      }
    }
  })
)

export const checkProjectIdValidator = validate(
  checkSchema(
    {
      projectId: {
        custom: {
          options: async (value) => {
            if (!ObjectId.isValid(value)) {
              throw new Error(projectMessages.PROJECT_ID_IS_INVALID)
            }
            const isIdProject = await projectService.checkIdProjectExist(value)
            if (!isIdProject) {
              throw new Error(projectMessages.PROJECT_ID_NOT_FOUND)
            }
            return true
          }
        }
      }
    },
    ['params']
  )
)
export const getAllProjectValidator = validate(
  checkSchema(
    {
      page: {
        custom: {
          options: async (value) => {
            const regex = /(\d*)/
            if (!regex.test(value)) {
              throw new Error(projectMessages.PAGE_IS_INVALID)
            }
            return true
          }
        }
      },
      limit: {
        custom: {
          options: async (value) => {
            const regex = /(\d*)/
            if (!regex.test(value)) {
              throw new Error(projectMessages.LIMIT_IS_INVALID)
            }
            return true
          }
        }
      }
    },
    ['query']
  )
)
export const checkParticipantValidator = validate(
  checkSchema(
    {
      projectId: {
        custom: {
          options: async (value) => {
            if (!ObjectId.isValid(value)) {
              throw new Error(projectMessages.PROJECT_ID_IS_INVALID)
            }
            const isIdProject = await projectService.checkIdProjectExist(value)
            if (!isIdProject) {
              throw new Error(projectMessages.PROJECT_ID_NOT_FOUND)
            }
            return true
          }
        }
      },
      participantId: {
        custom: {
          options: async (value) => {
            if (!ObjectId.isValid(value)) {
              throw new Error(projectMessages.PARTICIPANT_ID_IS_INVALID)
            }
            return true
          }
        }
      }
    },
    ['params']
  )
)
export const checkDateValidator: RequestHandler = (
  req: Request<ParamsDictionary, any, ICreateProjectReqBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body
    if (data.startDate > data.endDate) {
      return res.status(422).json({
        success: false,
        code: HTTP_STATUS.UNPROCESSABLE_ETITY,
        message: projectMessages.START_DATE_CANNOT_BE_AFTER_END_DATE
      })
    }
    next()
  } catch (error) {
    const err: Error = error as Error
    throw new Error(err.message)
  }
}
