import { Router } from 'express'
import projectController from '~/controllers/project.controllers'
import { accessTokenValidator, checkAuthValidator } from '~/middlewares/auth.middlewares'
import {
  checkDateValidator,
  checkExistParticipant,
  checkExistParticipantToDelete,
  checkParticipantValidator,
  checkProjectIdValidator,
  createProjectValidator,
  getAllProjectValidator,
  updateProjectValidator
} from '~/middlewares/project.middlewares'
const projectRouter = Router()

projectRouter.post(
  '/',
  accessTokenValidator,
  checkAuthValidator,
  createProjectValidator,
  checkDateValidator,
  projectController.create
)
projectRouter.put(
  '/:projectId',
  accessTokenValidator,
  checkAuthValidator,
  checkProjectIdValidator,
  updateProjectValidator,
  checkDateValidator,
  projectController.update
)
projectRouter.delete(
  '/:projectId',
  accessTokenValidator,
  checkAuthValidator,
  checkProjectIdValidator,
  projectController.delete
)
projectRouter.get(
  '/:projectId',
  accessTokenValidator,
  checkAuthValidator,
  checkProjectIdValidator,
  projectController.getProject
)
projectRouter.get(
  '/',
  accessTokenValidator,
  checkAuthValidator,
  getAllProjectValidator,
  projectController.getAllProject
)
projectRouter.patch(
  '/:projectId/participants/:participantId',
  accessTokenValidator,
  checkAuthValidator,
  checkParticipantValidator,
  checkExistParticipant,
  projectController.addParticipant
)
projectRouter.delete(
  '/:projectId/participants/:participantId',
  accessTokenValidator,
  checkAuthValidator,
  checkParticipantValidator,
  checkExistParticipantToDelete,
  projectController.deleteParticipant
)
export default projectRouter
