import { ObjectId } from 'mongodb'
import slug from 'slug'
import HTTP_STATUS from '~/constants/httpStatus'
import { projectMessages } from '~/constants/messages/project.messages'
import { IResponseMessage } from '~/interfaces/reponses/response'
import { IProjectReqBody } from '~/interfaces/requests/Project.requests'
import Project from '~/models/schemas/Project.schemas'
import { v4 as uuidv4 } from 'uuid'
import User from '~/models/schemas/User.schemas'

class ProjectService {
  async createProject(payload: IProjectReqBody): Promise<IResponseMessage<InstanceType<typeof Project>>> {
    const newProject = new Project({
      ...payload,
      slug: slug(`${payload.name} ${uuidv4()}`),
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
    updateData: IProjectReqBody
  ): Promise<IResponseMessage<InstanceType<typeof Project>>> {
    const updateProjectData = await Project.findByIdAndUpdate(
      { _id: new ObjectId(projectId) },
      {
        ...updateData,
        slug: slug(`${updateData.name} ${uuidv4()}`),
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
    const getData = await Project.aggregate([
      {
        $match: {
          _id: new ObjectId(projectId)
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'participants',
          foreignField: '_id',
          as: 'participants'
        }
      },
      {
        $lookup: {
          from: 'tasks',
          localField: 'tasks',
          foreignField: '_id',
          as: 'tasks'
        }
      },
      {
        $unset: 'participants.password'
      },
      {
        $unwind: {
          path: '$tasks',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'status',
          localField: 'tasks.status',
          foreignField: '_id',
          as: 'tasks.status'
        }
      },
      {
        $set: {
          'tasks.status': {
            $arrayElemAt: ['$tasks.status', 0]
          }
        }
      },
      {
        $group: {
          _id: '$_id',
          participants: {
            $first: '$participants'
          },
          slug: { $first: '$slug' },
          createdAt: { $first: '$createdAt' },
          startDate: { $first: '$startDate' },
          endDate: { $first: '$endDate' },
          name: { $first: '$name' },
          tasks: {
            $push: '$tasks'
          }
        }
      }
    ])
    return {
      success: true,
      code: HTTP_STATUS.OK,
      message: projectMessages.GET_PROJECT_SUCCESS,
      data: getData[0] as InstanceType<typeof Project>
    }
  }
  async getAllProject(page: number, pageSize: number): Promise<IResponseMessage<InstanceType<typeof Project>[]>> {
    const totalItems = await Project.countDocuments({})
    const totalPage = Math.ceil(totalItems / pageSize)
    const skip = (page - 1) * pageSize
    const data = await Project.aggregate([
      {
        $lookup: {
          from: 'tasks',
          localField: 'tasks',
          foreignField: '_id',
          as: 'tasks'
        }
      },
      {
        $unwind: {
          path: '$tasks',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'status',
          localField: 'tasks.status',
          foreignField: '_id',
          as: 'tasks.status'
        }
      },
      {
        $unwind: {
          path: '$tasks.status',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          isClosed: {
            $cond: {
              if: {
                $eq: ['$tasks.status.name', 'Closed']
              },
              then: true,
              else: false
            }
          }
        }
      },
      {
        $addFields: {
          isNull: {
            $cond: {
              if: {
                $eq: [{ $size: { $objectToArray: '$tasks' } }, 0]
              },
              then: true,
              else: false
            }
          }
        }
      },
      {
        $group: {
          _id: '$name',
          totalTasks: { $sum: { $cond: { if: '$isNull', then: 0, else: 1 } } },
          totalClosedTasks: { $sum: { $cond: { if: '$isClosed', then: 1, else: 0 } } }
        }
      },
      {
        $project: {
          name: '$_id',
          _id: 0,
          totalTasks: 1,
          totalClosedTasks: 1
        }
      },
      {
        $skip: skip
      },
      {
        $limit: pageSize
      }
    ])
    const getAllDataWithPaginate = data.map((item) => {
      return {
        ...item,
        process: `${item.totalClosedTasks}/${item.totalTasks}`
      }
    })
    return {
      success: true,
      code: HTTP_STATUS.OK,
      message: projectMessages.GET_ALL_PROJECT_WITH_PAGINATE_SUCCESS,
      data: getAllDataWithPaginate,
      totalItems,
      totalPage,
      currentPage: page
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
    await User.findByIdAndUpdate({ _id: participant }, { $push: { projects: new ObjectId(projectId) } }, { new: true })
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
    await User.updateOne({ _id: participant }, { $pull: { projects: new ObjectId(projectId) } })
    return {
      success: true,
      code: HTTP_STATUS.OK,
      message: projectMessages.DELETE_PARTICIPANT_SUCCESS
    }
  }
}
const projectService = new ProjectService()
export default projectService
