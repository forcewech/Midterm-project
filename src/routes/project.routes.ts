import { Router } from 'express'
import projectController from '~/controllers/project.controllers'
import {
  createProjectValidator,
  deleteProjectValidator,
  getProjectValidator,
  updateProjectValidator
} from '~/middlewares/project.middlewares'
const projectRouter = Router()

projectRouter.post('/', createProjectValidator, projectController.create)
projectRouter.put('/:projectId', updateProjectValidator, projectController.update)
projectRouter.delete('/:projectId', deleteProjectValidator, projectController.delete)
projectRouter.get('/:projectId', getProjectValidator, projectController.getProject)

export default projectRouter
