import { ObjectId } from 'mongodb'
import slug from 'slug'
import { projectMessages } from '~/constants/messages'
import { CreateProjectReqBody } from '~/models/requests/Project.requests'
import Project from '~/models/schemas/Project.schemas'

class ProjectService {
  async createProject(payload: CreateProjectReqBody): Promise<{ message: string; data: InstanceType<typeof Project> }> {
    const newProject = new Project({
      ...payload,
      slug: slug(payload.name),
      startDate: new Date(payload.startDate),
      endDate: new Date(payload.endDate)
    })
    await newProject.save()
    return {
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
  async checkSlugProjectExist(slug: string): Promise<boolean> {
    const projectSlug = await Project.findOne({ slug: slug })
    return Boolean(projectSlug)
  }
  async updateProjectById(
    projectId: string,
    updateData: CreateProjectReqBody
  ): Promise<{ message: string; data: InstanceType<typeof Project> }> {
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
      message: projectMessages.UPDATE_PROJECT_SUCCESS,
      data: updateProjectData as InstanceType<typeof Project>
    }
  }
  async deleteProjectById(projectId: string): Promise<{ message: string }> {
    await Project.findByIdAndDelete({ _id: new ObjectId(projectId) })
    return {
      message: projectMessages.DELETE_PROJECT_SUCCESS
    }
  }
  async getProjectBySlug(projectSlug: string): Promise<{ message: string; data: InstanceType<typeof Project> }> {
    const getData = await Project.findOne({ slug: projectSlug as string })
    return {
      message: projectMessages.DELETE_PROJECT_SUCCESS,
      data: getData as InstanceType<typeof Project>
    }
  }
}

const projectService = new ProjectService()
export default projectService
