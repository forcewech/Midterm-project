import { ParamsDictionary } from 'express-serve-static-core'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import { validate } from '~/utils/validation'
import { checkSchema } from 'express-validator'
import {
  priorityMessages,
  projectMessages,
  statusMessages,
  taskMessages,
  typeMessages,
  userMessages
} from '~/constants/messages'
import { priorityService, projectService, statusService, taskService, typeService, userService } from '~/services'
import { ObjectId } from 'mongodb'
import { Project, Status, Task } from '~/models/schemas'
import { EStatus } from '~/constants/enums'
import { ITaskReqBody } from '~/interfaces/requests'
import HTTP_STATUS from '~/constants/httpStatus'

export const createTaskValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: taskMessages.NAME_IS_REQUIRED
        },
        isString: {
          errorMessage: taskMessages.NAME_MUST_BE_A_STRING
        },
        custom: {
          options: async (value) => {
            if (value) {
              const isExistProject = await taskService.checkTaskExist(value)
              if (isExistProject) {
                throw new Error(taskMessages.NAME_TASK_ALREADY_EXISTS)
              }
            }
            return true
          }
        }
      },
      projectId: {
        notEmpty: {
          errorMessage: taskMessages.PROJECT_ID_IS_REQUIRED
        },
        custom: {
          options: async (value, { req }) => {
            if (!ObjectId.isValid(value)) {
              throw new Error(projectMessages.PROJECT_ID_IS_INVALID)
            }
            const isIdProject = await projectService.checkIdProjectExist(value)
            if (!isIdProject) {
              throw new Error(projectMessages.PROJECT_NOT_FOUND)
            }
            const project = await Project.findOne({ _id: value })
            req.projectId = project?._id
            req.startDateProject = project?.startDate
            req.endDateProject = project?.endDate
            return true
          }
        }
      },
      typeId: {
        notEmpty: {
          errorMessage: taskMessages.TYPE_ID_IS_REQUIRED
        },
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
      },
      priorityId: {
        notEmpty: {
          errorMessage: taskMessages.PRIORITY_ID_IS_REQUIRED
        },
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
      },
      statusId: {
        custom: {
          options: async (value, { req }) => {
            if (value) {
              if (!ObjectId.isValid(value)) {
                throw new Error(statusMessages.STATUS_ID_IS_INVALID)
              }
              const isIdStatus = await statusService.checkIdStatusExist(value)
              if (!isIdStatus) {
                throw new Error(statusMessages.STATUS_NOT_FOUND)
              }
            } else {
              const defaultNew = await Status.findOne({ name: EStatus.NEW })
              req.defaultNew = defaultNew ? defaultNew : null
            }
            return true
          }
        }
      },
      assignedTo: {
        custom: {
          options: async (value) => {
            if (value) {
              if (!ObjectId.isValid(value)) {
                throw new Error(userMessages.USER_ID_IS_INVALID)
              }
              const isIdUser = await userService.checkIdUserExist(value)
              if (!isIdUser) {
                throw new Error(userMessages.USER_NOT_FOUND)
              }
            }
            return true
          }
        }
      },
      startDate: {
        notEmpty: {
          errorMessage: taskMessages.START_DATE_REQUIRED
        },
        isISO8601: {
          options: {
            strict: true,
            strictSeparator: true
          },
          errorMessage: taskMessages.START_DATE_MUST_BE_ISO8601
        }
      },
      endDate: {
        notEmpty: {
          errorMessage: taskMessages.END_DATE_REQUIRED
        },
        isISO8601: {
          options: {
            strict: true,
            strictSeparator: true
          },
          errorMessage: taskMessages.END_DATE_MUST_BE_ISO8601
        }
      }
    },
    ['body']
  )
)
export const updateTaskValidator = validate(
  checkSchema(
    {
      name: {
        optional: true,
        custom: {
          options: async (value) => {
            if (value) {
              const isExistProject = await taskService.checkTaskExist(value)
              if (isExistProject) {
                throw new Error(taskMessages.NAME_TASK_ALREADY_EXISTS)
              }
            }
            return true
          }
        }
      },
      projectId: {
        optional: true,
        custom: {
          options: async (value, { req }) => {
            if (value) {
              if (!ObjectId.isValid(value)) {
                throw new Error(projectMessages.PROJECT_ID_IS_INVALID)
              }
              const isIdProject = await projectService.checkIdProjectExist(value)
              if (!isIdProject) {
                throw new Error(projectMessages.PROJECT_NOT_FOUND)
              }
              const project = await Project.findOne({ _id: value })
              req.projectId = project?._id
              req.startDateProject = project?.startDate
              req.endDateProject = project?.endDate
            }
            return true
          }
        }
      },
      typeId: {
        optional: true,
        custom: {
          options: async (value) => {
            if (value) {
              if (!ObjectId.isValid(value)) {
                throw new Error(typeMessages.TYPE_ID_IS_INVALID)
              }
              const isIdType = await typeService.checkIdTypeExist(value)
              if (!isIdType) {
                throw new Error(typeMessages.TYPE_NOT_FOUND)
              }
            }
            return true
          }
        }
      },
      priorityId: {
        optional: true,
        custom: {
          options: async (value) => {
            if (value) {
              if (!ObjectId.isValid(value)) {
                throw new Error(priorityMessages.PRIORITY_ID_IS_INVALID)
              }
              const isIdPriority = await priorityService.checkIdPriorityExist(value)
              if (!isIdPriority) {
                throw new Error(priorityMessages.PRIORITY_NOT_FOUND)
              }
            }
            return true
          }
        }
      },
      statusId: {
        optional: true,
        custom: {
          options: async (value) => {
            if (value) {
              if (!ObjectId.isValid(value)) {
                throw new Error(statusMessages.STATUS_ID_IS_INVALID)
              }
              const isIdStatus = await statusService.checkIdStatusExist(value)
              if (!isIdStatus) {
                throw new Error(statusMessages.STATUS_NOT_FOUND)
              }
            }
            return true
          }
        }
      },
      assignedTo: {
        optional: true,
        custom: {
          options: async (value) => {
            if (value) {
              if (!ObjectId.isValid(value)) {
                throw new Error(userMessages.USER_ID_IS_INVALID)
              }
              const isIdUser = await userService.checkIdUserExist(value)
              if (!isIdUser) {
                throw new Error(userMessages.USER_NOT_FOUND)
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
          errorMessage: taskMessages.START_DATE_MUST_BE_ISO8601
        }
      },
      endDate: {
        optional: true,
        isISO8601: {
          options: {
            strict: true,
            strictSeparator: true
          },
          errorMessage: taskMessages.END_DATE_MUST_BE_ISO8601
        }
      }
    },
    ['body']
  )
)
export const dateInProjectValidator: RequestHandler = async (
  req: Request<ParamsDictionary, any, ITaskReqBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body
    const taskId = req.params.taskId
    const dateInTask = await Task.aggregate([
      {
        $match: {
          _id: new ObjectId(taskId)
        }
      },
      {
        $lookup: {
          from: 'projects',
          localField: 'project',
          foreignField: '_id',
          as: 'project'
        }
      },
      {
        $set: {
          project: {
            $arrayElemAt: ['$project', 0]
          }
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
    const dateInProject = await Project.aggregate([
      {
        $match: {
          _id: new ObjectId(data.projectId)
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
    const projectInTask = await Project.findOne({ tasks: new ObjectId(taskId) })
    const startDateTask = data?.startDate ?? dateInTask[0].startDate.toISOString()
    const endDateTask = data?.endDate ?? dateInTask[0].endDate.toISOString()
    const startDateProject = dateInProject[0]?.startDate.toISOString() ?? projectInTask?.startDate.toISOString()
    const endDateProject = dateInProject[0]?.endDate.toISOString() ?? projectInTask?.endDate.toISOString()
    if (startDateTask < startDateProject || endDateTask > endDateProject) {
      return res.status(HTTP_STATUS.UNPROCESSABLE_ETITY).json({
        success: false,
        code: HTTP_STATUS.UNPROCESSABLE_ETITY,
        message: taskMessages.START_DATE_AND_END_DATE_WITHIN_PROJECT
      })
    }
    next()
  } catch (error) {
    const err: Error = error as Error
    throw new Error(err.message)
  }
}
export const checkTaskIdValidator = validate(
  checkSchema(
    {
      taskId: {
        custom: {
          options: async (value) => {
            if (!ObjectId.isValid(value)) {
              throw new Error(taskMessages.TASK_ID_IS_INVALID)
            }
            const isIdTask = await taskService.checkIdTaskExist(value)
            if (!isIdTask) {
              throw new Error(taskMessages.TASK_NOT_FOUND)
            }
            return true
          }
        }
      }
    },
    ['params']
  )
)
export const getAllTaskValidator = validate(
  checkSchema(
    {
      page: {
        custom: {
          options: async (value) => {
            if (value) {
              const regex = /^\d+$/
              if (!regex.test(value)) {
                throw new Error(taskMessages.PAGE_IS_INVALID)
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
                throw new Error(taskMessages.LIMIT_IS_INVALID)
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
export const checkUsersInProject: RequestHandler = async (
  req: Request<ParamsDictionary, any, ITaskReqBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const projectId = req.body.projectId
    const assignedTo = req.body.assignedTo
    if (projectId && assignedTo) {
      const data = await Project.aggregate([
        {
          $match: {
            _id: new ObjectId(projectId),
            participants: new ObjectId(assignedTo)
          }
        }
      ])
      if (!data.length) {
        return res.status(HTTP_STATUS.UNPROCESSABLE_ETITY).json({
          success: false,
          code: HTTP_STATUS.UNPROCESSABLE_ETITY,
          message: taskMessages.USER_IS_NOT_A_MEMBER_OF_THE_PROJECT
        })
      }
    }
    next()
  } catch (error) {
    const err: Error = error as Error
    throw new Error(err.message)
  }
}
