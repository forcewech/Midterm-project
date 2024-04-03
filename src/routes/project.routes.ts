import { Router } from 'express'
import projectController from '~/controllers/project.controllers'
import { accessTokenValidator, checkAuthValidator } from '~/middlewares/auth.middlewares'
import {
  createProjectValidator,
  deleteProjectValidator,
  getAllProjectValidator,
  getProjectValidator,
  updateProjectValidator
} from '~/middlewares/project.middlewares'
const projectRouter = Router()

projectRouter.post('/', createProjectValidator, accessTokenValidator, checkAuthValidator, projectController.create)
projectRouter.put(
  '/:projectId',
  updateProjectValidator,
  accessTokenValidator,
  checkAuthValidator,
  projectController.update
)
projectRouter.delete(
  '/:projectId',
  deleteProjectValidator,
  accessTokenValidator,
  checkAuthValidator,
  projectController.delete
)
projectRouter.get(
  '/:projectId',
  getProjectValidator,
  accessTokenValidator,
  checkAuthValidator,
  projectController.getProject
)
projectRouter.get(
  '/',
  getAllProjectValidator,
  accessTokenValidator,
  checkAuthValidator,
  projectController.getAllProject
)
projectRouter.patch(
  '/:projectId/participants/:participantId',
  getProjectValidator,
  accessTokenValidator,
  checkAuthValidator,
  projectController.addParticipant
)
projectRouter.delete(
  '/:projectId/participants/:participantId',
  accessTokenValidator,
  checkAuthValidator,
  projectController.deleteParticipant
)
export default projectRouter
