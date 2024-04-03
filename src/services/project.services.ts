import { ObjectId } from 'mongodb'
import slug from 'slug'
import HTTP_STATUS from '~/constants/httpStatus'
import { projectMessages } from '~/constants/messages/project.messages'
import { IResponseMessage } from '~/interfaces/reponses/response'
import { CreateProjectReqBody } from '~/interfaces/requests/Project.requests'
import Project from '~/models/schemas/Project.schemas'

class ProjectService {
  async createProject(payload: CreateProjectReqBody): Promise<IResponseMessage<InstanceType<typeof Project>>> {
    const newProject = new Project({
      ...payload,
      slug: slug(payload.name),
      startDate: new Date(payload.startDate),
      endDate: new Date(payload.endDate)
    })
    await newProject.save()
    return {
      success: true,
      code: HTTP_STATUS.CREATED,
      message: projectMessages.CREATE_PROJECT_SUCCESS,
      data: newProject
    }
  }
  async checkProjectExist(name: string): Promise<boolean> {
    const project = await Project.findOne({ name })
    return Boolean(project)
  }
  async checkIdProjectExist(id: string): Promise<boolean> {
    const projectId = await Project.findOne({ _id: new ObjectId(id) })
    return Boolean(projectId)
  }
  async updateProjectById(
    projectId: string,
    updateData: CreateProjectReqBody
  ): Promise<IResponseMessage<InstanceType<typeof Project>>> {
    const updateProjectData = await Project.findByIdAndUpdate(
      { _id: new ObjectId(projectId) },
      {
        ...updateData,
        slug: slug(updateData.name),
        startDate: new Date(updateData.startDate),
        endDate: new Date(updateData.endDate)
      },
      { new: true }
    )
    return {
      success: true,
      code: HTTP_STATUS.OK,
      message: projectMessages.UPDATE_PROJECT_SUCCESS,
      data: updateProjectData as InstanceType<typeof Project>
    }
  }
  async deleteProjectById(projectId: string): Promise<IResponseMessage<InstanceType<typeof Project>>> {
    await Project.findByIdAndDelete({ _id: new ObjectId(projectId) })
    return {
      success: true,
      code: HTTP_STATUS.OK,
      message: projectMessages.DELETE_PROJECT_SUCCESS
    }
  }
  async getProjectById(projectId: string): Promise<IResponseMessage<InstanceType<typeof Project>>> {
    const getData = await Project.findById({ _id: new ObjectId(projectId) })
    return {
      success: true,
      code: HTTP_STATUS.OK,
      message: projectMessages.GET_PROJECT_SUCCESS,
      data: getData as InstanceType<typeof Project>
    }
  }
  async getAllProject(page: number, pageSize: number): Promise<IResponseMessage<InstanceType<typeof Project>[]>> {
    if (page && pageSize) {
      const skip = (page - 1) * pageSize
      const getAllDataWithPaginate = await Project.find({}).skip(skip).limit(pageSize)
      return {
        success: true,
        code: HTTP_STATUS.OK,
        message: projectMessages.GET_ALL_PROJECT_WITH_PAGINATE_SUCCESS,
        data: getAllDataWithPaginate as InstanceType<typeof Project>[]
      }
    } else {
      const defaultPageSize = 10
      const defaultPage = 1
      const defaultSkip = (defaultPage - 1) * defaultPageSize
      const getAllData = await Project.find({}).skip(defaultSkip).limit(defaultPageSize)
      return {
        success: true,
        code: HTTP_STATUS.OK,
        message: projectMessages.GET_ALL_PROJECT_SUCCESS,
        data: getAllData
      }
    }
  }
  async addParticipant(
    projectId: string,
    participant: ObjectId
  ): Promise<IResponseMessage<InstanceType<typeof Project>>> {
    const project = (await Project.findById({ _id: new ObjectId(projectId) })) as InstanceType<typeof Project>
    let isParticipantExists = false
    project.participants.forEach((item) => {
      if (item.toString() === participant.toString()) {
        isParticipantExists = true
      }
    })
    if (isParticipantExists) {
      return {
        success: false,
        code: HTTP_STATUS.CONFLICT,
        message: projectMessages.PARTICIPANT_ALREADY_EXISTS
      }
    }
    project.participants.push(participant)
    project.save()
    return {
      success: true,
      code: HTTP_STATUS.OK,
      message: projectMessages.ADD_PARTICIPANT_SUCCESS
    }
  }
  async deleteParticipant(
    projectId: string,
    participant: ObjectId
  ): Promise<IResponseMessage<InstanceType<typeof Project>>> {
    const project = (await Project.findById({ _id: new ObjectId(projectId) })) as InstanceType<typeof Project>
    let isParticipantExists = false
    project.participants.forEach((item) => {
      if (item.toString() === participant.toString()) {
        isParticipantExists = true
      }
    })
    if (!isParticipantExists) {
      return {
        success: false,
        code: HTTP_STATUS.NOT_FOUND,
        message: projectMessages.PARTICIPANT_ID_NOT_FOUND
      }
    }
    project.participants = project.participants.filter((item) => {
      return item.toString() !== participant.toString()
    })
    await project.save()
    return {
      success: true,
      code: HTTP_STATUS.OK,
      message: projectMessages.DELETE_PARTICIPANT_SUCCESS
    }
  }
}
const projectService = new ProjectService()
export default projectService
