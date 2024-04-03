import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { IResponseMessage } from '~/interfaces/reponses/response'
import { ICreateProjectReqBody } from '~/interfaces/requests/Project.requests'
import Project from '~/models/schemas/Project.schemas'
import projectService from '~/services/project.services'

class ProjectController {
  async create(
    req: Request<ParamsDictionary, any, ICreateProjectReqBody>,
    res: Response
  ): Promise<Response<IResponseMessage<typeof Project>>> {
    try {
      const result = await projectService.createProject(req.body)
      return res.status(201).json(result)
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
  async update(
    req: Request<ParamsDictionary, any, ICreateProjectReqBody>,
    res: Response
  ): Promise<Response<IResponseMessage<typeof Project>>> {
    try {
      const projectId = req.params.projectId
      const result = await projectService.updateProjectById(projectId, req.body)
      return res.json(result)
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
  async delete(req: Request, res: Response): Promise<Response<IResponseMessage<typeof Project>>> {
    try {
      const projectId = req.params.projectId
      const result = await projectService.deleteProjectById(projectId)
      return res.json(result)
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
  async getProject(req: Request, res: Response): Promise<Response<IResponseMessage<typeof Project>>> {
    try {
      const projectId = req.params.projectId
      const result = await projectService.getProjectById(projectId)
      return res.json(result)
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
  async getAllProject(req: Request, res: Response): Promise<Response<IResponseMessage<typeof Project>[]>> {
    try {
      const page = parseInt(req.query.page as string)
      const pageSize = parseInt(req.query.limit as string)
      const result = await projectService.getAllProject(page, pageSize)
      return res.json(result)
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
  async addParticipant(req: Request, res: Response): Promise<Response<IResponseMessage<typeof Project>>> {
    try {
      const projectId = req.params.projectId
      const participant = req.params.participantId
      const result = await projectService.addParticipant(projectId, new ObjectId(participant))
      if (result.success === false) {
        return res.status(409).json(result)
      }
      return res.json(result)
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
  async deleteParticipant(req: Request, res: Response): Promise<Response<IResponseMessage<typeof Project>>> {
    try {
      const projectId = req.params.projectId
      const participant = req.params.participantId
      const result = await projectService.deleteParticipant(projectId, new ObjectId(participant))
      if (result.success === false) {
        return res.status(404).json(result)
      }
      return res.json(result)
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
}

const projectController = new ProjectController()
export default projectController
