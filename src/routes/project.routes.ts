import { Router } from 'express'
import projectController from '~/controllers/project.controllers'
import { accessTokenValidator } from '~/middlewares/auth.middlewares'
import {
  createProjectValidator,
  deleteProjectValidator,
  getAllProjectValidator,
  getProjectValidator,
  updateProjectValidator
} from '~/middlewares/project.middlewares'
const projectRouter = Router()

projectRouter.post('/', createProjectValidator, accessTokenValidator, projectController.create)
projectRouter.put('/:projectId', updateProjectValidator, accessTokenValidator, projectController.update)
projectRouter.delete('/:projectId', deleteProjectValidator, accessTokenValidator, projectController.delete)
projectRouter.get('/:projectId', getProjectValidator, accessTokenValidator, projectController.getProject)
projectRouter.get('/', getAllProjectValidator, accessTokenValidator, projectController.getAllProject)
projectRouter.patch(
  '/:projectId/participants/:participantId',
  getProjectValidator,
  accessTokenValidator,
  projectController.addParticipant
)
projectRouter.delete(
  '/:projectId/participants/:participantId',
  accessTokenValidator,
  projectController.deleteParticipant
)
export default projectRouter
