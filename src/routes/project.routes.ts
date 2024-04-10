import { Router } from 'express'
import { projectController } from '~/controllers'
import {
  accessTokenValidator,
  checkAuthValidator,
  checkDateValidator,
  checkExistParticipant,
  checkExistParticipantToDelete,
  checkParticipantValidator,
  checkProjectIdValidator,
  createProjectValidator,
  getAllProjectValidator,
  updateProjectValidator
} from '~/middlewares'
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
projectRouter.get(
  '/user/projects',
  accessTokenValidator,
  checkAuthValidator,
  getAllProjectValidator,
  projectController.getMyProjects
)

export { projectRouter }
