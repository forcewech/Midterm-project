import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { CreateProjectReqBody } from '~/models/requests/Project.requests'
import projectService from '~/services/project.services'
import Project from '~/models/schemas/Project.schemas'

class ProjectController {
  async create(
    req: Request<ParamsDictionary, any, CreateProjectReqBody>,
    res: Response,
    next: NextFunction
  ): Promise<Response<string, Record<string, InstanceType<typeof Project>>> | undefined> {
    try {
      const result = await projectService.createProject(req.body)
      return res.json(result)
    } catch (error) {
      next(error)
    }
  }
  async update(
    req: Request<ParamsDictionary, any, CreateProjectReqBody>,
    res: Response,
    next: NextFunction
  ): Promise<Response<string, Record<string, InstanceType<typeof Project>>> | undefined> {
    try {
      const projectId = req.params.projectId
      const result = await projectService.updateProjectById(projectId, req.body)
      return res.json(result)
    } catch (error) {
      next(error)
    }
  }
  async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<string, Record<string, InstanceType<typeof Project>>> | undefined> {
    try {
      const projectId = req.params.projectId
      const result = await projectService.deleteProjectById(projectId)
      return res.json(result)
    } catch (error) {
      next(error)
    }
  }
  async getProject(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<string, Record<string, InstanceType<typeof Project>>> | undefined> {
    try {
      const projectSlug = req.params.projectSlug
      const result = await projectService.getProjectBySlug(projectSlug)
      return res.json(result)
    } catch (error) {
      next(error)
    }
  }
}

const projectController = new ProjectController()
export default projectController
