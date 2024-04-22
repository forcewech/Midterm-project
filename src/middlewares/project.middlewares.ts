import { NextFunction, Request, RequestHandler, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { projectMessages, userMessages } from '~/constants/messages'
import { IProjectReqBody } from '~/interfaces/requests'
import { Project } from '~/models/schemas'
import { projectService, userService } from '~/services'
import { validate } from '~/utils/validation'

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
        isLength: {
          options: { max: 50 },
          errorMessage: projectMessages.NAME_SHOULD_NOT_EXCEED_50_CHARACTERS
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
        notEmpty: {
          errorMessage: projectMessages.START_DATE_REQUIRED
        },
        isISO8601: {
          options: {
            strict: true,
            strictSeparator: true
          },
          errorMessage: projectMessages.START_DATE_MUST_BE_ISO8601
        }
      },
      endDate: {
        notEmpty: {
          errorMessage: projectMessages.END_DATE_REQUIRED
        },
        isISO8601: {
          options: {
            strict: true,
            strictSeparator: true
          },
          errorMessage: projectMessages.END_DATE_MUST_BE_ISO8601
        }
      }
    },
    ['body']
  )
)

export const updateProjectValidator = validate(
  checkSchema({
    name: {
      optional: true,
      isLength: {
        options: { max: 50 },
        errorMessage: projectMessages.NAME_SHOULD_NOT_EXCEED_50_CHARACTERS
      },
      custom: {
        options: async (value) => {
          if (value) {
            const isExistProject = await projectService.checkProjectExist(value)
            if (isExistProject) {
              throw new Error(projectMessages.NAME_PROJECT_ALREADY_EXISTS)
            }
          }
          return true
        }
      }
    },
    startDate: {
      optional: true,
      isISO8601: {
        options: {
          strict: true,
          strictSeparator: true
        },
        errorMessage: projectMessages.START_DATE_MUST_BE_ISO8601
      }
    },
    endDate: {
      optional: true,
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
              throw new Error(projectMessages.PROJECT_NOT_FOUND)
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
            if (value) {
              const regex = /^\d+$/
              if (!regex.test(value)) {
                throw new Error(projectMessages.PAGE_IS_INVALID)
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
                throw new Error(projectMessages.LIMIT_IS_INVALID)
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
              throw new Error(projectMessages.PROJECT_NOT_FOUND)
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
            const isIdParticipant = await userService.checkIdUserExist(value)
            if (!isIdParticipant) {
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
export const checkDateValidator: RequestHandler = async (
  req: Request<ParamsDictionary, any, IProjectReqBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body
    const projectId = req.params.projectId
    const dateInProject = await Project.aggregate([
      {
        $match: {
          _id: new ObjectId(projectId)
        }
      },
      {
        $project: {
          _id: 0,
          startDate: 1,
          endDate: 1
        }
      }
    ])
    const startDateProject = data.startDate ?? dateInProject[0].startDate.toISOString()
    const endDateProject = data.endDate ?? dateInProject[0].endDate.toISOString()
    if (startDateProject > endDateProject) {
      return res.status(HTTP_STATUS.UNPROCESSABLE_ETITY).json({
        success: false,
        code: HTTP_STATUS.UNPROCESSABLE_ETITY,
        message: projectMessages.START_DATE_CANNOT_BE_AFTER_END_DATE
      })
    }
    if (startDateProject < new Date().toISOString()) {
      return res.status(HTTP_STATUS.UNPROCESSABLE_ETITY).json({
        success: false,
        code: HTTP_STATUS.UNPROCESSABLE_ETITY,
        message: projectMessages.START_DATE_CANNOT_START_IN_THE_PAST
      })
    }
    next()
  } catch (error) {
    const err: Error = error as Error
    throw new Error(err.message)
  }
}

export const checkExistParticipant: RequestHandler = async (
  req: Request<ParamsDictionary, any, IProjectReqBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const projectId = req.params.projectId
    const participant = req.params.participantId
    const project = (await Project.findById({ _id: new ObjectId(projectId) })) as InstanceType<typeof Project>
    let isParticipantExists = false
    project.participants.forEach((item) => {
      if (item.toString() === participant.toString()) {
        isParticipantExists = true
      }
    })
    if (isParticipantExists) {
      return res.status(HTTP_STATUS.UNPROCESSABLE_ETITY).json({
        success: false,
        code: HTTP_STATUS.CONFLICT,
        message: projectMessages.PARTICIPANT_ALREADY_EXISTS
      })
    }
    next()
  } catch (error) {
    const err: Error = error as Error
    throw new Error(err.message)
  }
}

export const checkExistParticipantToDelete: RequestHandler = async (
  req: Request<ParamsDictionary, any, IProjectReqBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const projectId = req.params.projectId
    const participant = req.params.participantId
    const project = (await Project.findById({ _id: new ObjectId(projectId) })) as InstanceType<typeof Project>
    let isParticipantExists = false
    project.participants.forEach((item) => {
      if (item.toString() === participant.toString()) {
        isParticipantExists = true
      }
    })
    if (!isParticipantExists) {
      return res.status(HTTP_STATUS.UNPROCESSABLE_ETITY).json({
        success: false,
        code: HTTP_STATUS.UNPROCESSABLE_ETITY,
        message: projectMessages.PARTICIPANT_NOT_EXIST
      })
    }
    next()
  } catch (error) {
    const err: Error = error as Error
    throw new Error(err.message)
  }
}
export const checkParticipantInProject: RequestHandler = async (
  req: Request<ParamsDictionary, any, IProjectReqBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const projectId = req.params.projectId
    const participant = req.decodedAuthorization?.userId
    const data = await Project.aggregate([
      {
        $match: {
          _id: new ObjectId(projectId),
          participants: new ObjectId(participant)
        }
      }
    ])
    if (!data.length) {
      return res.status(HTTP_STATUS.UNPROCESSABLE_ETITY).json({
        success: false,
        code: HTTP_STATUS.UNPROCESSABLE_ETITY,
        message: projectMessages.PARTICIPANT_NOT_EXIST
      })
    }
    next()
  } catch (error) {
    const err: Error = error as Error
    throw new Error(err.message)
  }
}
