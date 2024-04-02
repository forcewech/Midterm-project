import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { CreateProjectReqBody } from '~/models/requests/Project.requests'
import projectService from '~/services/project.services'
import Project from '~/models/schemas/Project.schemas'
import { IResponseMessage } from '~/models/reponses/response'

class ProjectController {
  async create(
    req: Request<ParamsDictionary, any, CreateProjectReqBody>,
    res: Response
  ): Promise<Response<IResponseMessage<typeof Project>>> {
    try {
      const result = await projectService.createProject(req.body)
      return res.json(result)
    } catch (error) {
      const err: Error = error as Error
      throw new Error(err.message)
    }
  }
  async update(
    req: Request<ParamsDictionary, any, CreateProjectReqBody>,
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
  async delete(req: Request, res: Response, next: NextFunction): Promise<Response<IResponseMessage<typeof Project>>> {
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
}

const projectController = new ProjectController()
export default projectController
