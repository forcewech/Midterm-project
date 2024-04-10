import slug from 'slug'
import { IProjectReqBody } from '~/interfaces/requests'
import { Project, User } from '~/models/schemas'
import { v4 as uuidv4 } from 'uuid'
import { ObjectId } from 'mongodb'
import { IResponseMessage } from '~/interfaces/reponses/response'

class ProjectService {
  async createProject(payload: IProjectReqBody): Promise<InstanceType<typeof Project>> {
    const newProject = new Project({
      ...payload,
      slug: slug(`${payload.name} ${uuidv4()}`),
      startDate: new Date(payload.startDate),
      endDate: new Date(payload.endDate)
    })
    await newProject.save()
    return newProject
  }
  async checkProjectExist(name: string): Promise<boolean> {
    const project = await Project.findOne({ name })
    return Boolean(project)
  }
  async checkIdProjectExist(id: string): Promise<boolean> {
    const projectId = await Project.findOne({ _id: new ObjectId(id) })
    return Boolean(projectId)
  }
  async updateProjectById(projectId: string, updateData: IProjectReqBody): Promise<InstanceType<typeof Project>> {
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
    return updateProjectData as InstanceType<typeof Project>
  }
  async deleteProjectById(projectId: string): Promise<InstanceType<typeof Project>> {
    return (await Project.findByIdAndDelete({ _id: new ObjectId(projectId) })) as InstanceType<typeof Project>
  }
  async getProjectById(projectId: string): Promise<InstanceType<typeof Project>> {
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
    return getData[0] as InstanceType<typeof Project>
  }
  async getAllProject(page: number, pageSize: number): Promise<IResponseMessage<InstanceType<typeof Project>[]>> {
    const totalItems = await Project.countDocuments({})
    const totalPage = Math.ceil(totalItems / pageSize)
    const skip = (page - 1) * pageSize
    const data = await Project.aggregate([
      {
        $addFields: {
          totalTasks: {
            $size: '$tasks'
          }
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
        $group: {
          _id: '$_id',
          totalTasks: {
            $sum: 1
          },
          totalClosedTasks: {
            $sum: {
              $cond: {
                if: '$isClosed',
                then: 1,
                else: 0
              }
            }
          },
          name: {
            $first: '$name'
          },
          slug: {
            $first: '$slug'
          },
          startDate: {
            $first: '$startDate'
          },
          endDate: {
            $first: '$endDate'
          },
          createdAt: {
            $first: '$createdAt'
          },
          participants: {
            $first: '$participants'
          }
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
      data: getAllDataWithPaginate,
      totalItems,
      totalPage,
      currentPage: page
    }
  }
  async addParticipant(projectId: string, participant: ObjectId): Promise<void> {
    const project = (await Project.findById({ _id: new ObjectId(projectId) })) as InstanceType<typeof Project>
    project.participants.push(participant)
    project.save()
    await User.findByIdAndUpdate({ _id: participant }, { $push: { projects: new ObjectId(projectId) } }, { new: true })
  }
  async deleteParticipant(projectId: string, participant: ObjectId): Promise<void> {
    const project = (await Project.findById({ _id: new ObjectId(projectId) })) as InstanceType<typeof Project>
    project.participants = project.participants.filter((item) => {
      return item.toString() !== participant.toString()
    })
    await project.save()
    await User.updateOne({ _id: participant }, { $pull: { projects: new ObjectId(projectId) } })
  }
}
const projectService = new ProjectService()
export { projectService }
