import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '~/constants/constant'
import HTTP_STATUS from '~/constants/httpStatus'
import { projectMessages } from '~/constants/messages/project.messages'
import { IResponseMessage } from '~/interfaces/reponses/response'
import { IProjectReqBody } from '~/interfaces/requests/Project.requests'
import Project from '~/models/schemas/Project.schemas'
import projectService from '~/services/project.services'

class ProjectController {
  async create(
    req: Request<ParamsDictionary, any, IProjectReqBody>,
    res: Response
  ): Promise<Response<IResponseMessage<typeof Project>>> {
    try {
      const data = await projectService.createProject(req.body)
      return res.status(HTTP_STATUS.CREATED).json({
        success: true,
        code: HTTP_STATUS.CREATED,
        message: projectMessages.CREATE_PROJECT_SUCCESS,
        data
      })
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
  async update(
    req: Request<ParamsDictionary, any, IProjectReqBody>,
    res: Response
  ): Promise<Response<IResponseMessage<typeof Project>>> {
    try {
      const projectId = req.params.projectId
      const data = await projectService.updateProjectById(projectId, req.body)
      return res.json({
        success: true,
        code: HTTP_STATUS.OK,
        message: projectMessages.UPDATE_PROJECT_SUCCESS,
        data
      })
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
  async delete(req: Request, res: Response): Promise<Response<IResponseMessage<typeof Project>>> {
    try {
      const projectId = req.params.projectId
      await projectService.deleteProjectById(projectId)
      return res.json({
        success: true,
        code: HTTP_STATUS.OK,
        message: projectMessages.DELETE_PROJECT_SUCCESS
      })
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
  async getProject(req: Request, res: Response): Promise<Response<IResponseMessage<typeof Project>>> {
    try {
      const projectId = req.params.projectId
      const data = await projectService.getProjectById(projectId)
      return res.json({
        success: true,
        code: HTTP_STATUS.OK,
        message: projectMessages.GET_PROJECT_SUCCESS,
        data
      })
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
  async getAllProject(req: Request, res: Response): Promise<Response<IResponseMessage<typeof Project>[]>> {
    try {
      const page = parseInt(req.query.page as string) || DEFAULT_PAGE
      const pageSize = parseInt(req.query.limit as string) || DEFAULT_LIMIT
      const data = await projectService.getAllProject(page, pageSize)
      return res.json({
        success: true,
        code: HTTP_STATUS.OK,
        message: projectMessages.GET_ALL_PROJECT_WITH_PAGINATE_SUCCESS,
        data
      })
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
  async addParticipant(req: Request, res: Response): Promise<Response<IResponseMessage<typeof Project>>> {
    try {
      const projectId = req.params.projectId
      const participant = req.params.participantId
      await projectService.addParticipant(projectId, new ObjectId(participant))
      return res.json({
        success: true,
        code: HTTP_STATUS.OK,
        message: projectMessages.ADD_PARTICIPANT_SUCCESS
      })
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
  async deleteParticipant(req: Request, res: Response): Promise<Response<IResponseMessage<typeof Project>>> {
    try {
      const projectId = req.params.projectId
      const participant = req.params.participantId
      await projectService.deleteParticipant(projectId, new ObjectId(participant))
      return res.json({
        success: true,
        code: HTTP_STATUS.OK,
        message: projectMessages.DELETE_PARTICIPANT_SUCCESS
      })
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
}

const projectController = new ProjectController()
export default projectController
