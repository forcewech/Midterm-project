import { ObjectId } from 'mongodb'
import { INVITE_SECRET_KEY, INVITE_TOKEN_EXPIRES_IN } from '~/config/env-config'
import HTTP_STATUS from '~/constants/httpStatus'
import { userMessages } from '~/constants/messages/user.messages'
import { IResponseMessage } from '~/interfaces/reponses/response'
import { IUpdateUser } from '~/interfaces/requests/User.requests'
import InviteId from '~/models/schemas/InviteId.schemas'
import User from '~/models/schemas/User.schemas'
import { signToken } from '~/utils/jwt'
class UserService {
  private async signInviteId(projectId: string): Promise<string> {
    return signToken({
      payload: {
        projectId
      },
      privateKey: INVITE_SECRET_KEY as string,
      options: {
        expiresIn: INVITE_TOKEN_EXPIRES_IN
      }
    })
  }
  async createInviteId(projectId: string): Promise<IResponseMessage<InstanceType<typeof InviteId>>> {
    const newInviteId = new InviteId({
      code: await this.signInviteId(projectId)
    })
    await newInviteId.save()
    return {
      success: true,
      code: HTTP_STATUS.CREATED,
      message: userMessages.CREATE_INVITE_ID_SUCCESS,
      data: newInviteId
    }
  }
  async getAllUser(page: number, pageSize: number): Promise<IResponseMessage<InstanceType<typeof User>[]>> {
    const totalItems = await User.countDocuments({})
    const totalPage = Math.ceil(totalItems / pageSize)
    const skip = (page - 1) * pageSize
    const getAllDataWithPaginate = await User.aggregate([
      {
        $unset: ['password']
      },
      {
        $skip: skip
      },
      {
        $limit: pageSize
      }
    ])
    return {
      success: true,
      code: HTTP_STATUS.OK,
      message: userMessages.GET_ALL_USER_WITH_PAGINATE_SUCCESS,
      data: getAllDataWithPaginate as InstanceType<typeof User>[],
      totalItems,
      totalPage,
      currentPage: page
    }
  }
  async checkIdUserExist(id: string): Promise<boolean> {
    const projectId = await User.findOne({ _id: new ObjectId(id) })
    return Boolean(projectId)
  }
  async getUserById(userId: string): Promise<IResponseMessage<InstanceType<typeof User>>> {
    const getData = await User.aggregate([
      {
        $match: {
          _id: new ObjectId(userId)
        }
      },
      {
        $unset: ['password']
      }
    ])
    return {
      success: true,
      code: HTTP_STATUS.OK,
      message: userMessages.GET_USER_SUCCESS,
      data: getData[0] as InstanceType<typeof User>
    }
  }
  async deleteUserById(userId: string): Promise<IResponseMessage<InstanceType<typeof User>>> {
    await User.findByIdAndDelete({ _id: new ObjectId(userId) })
    return {
      success: true,
      code: HTTP_STATUS.OK,
      message: userMessages.DELETE_USER_SUCCESS
    }
  }
  async updateUserById(userId: string, updateData: IUpdateUser): Promise<IResponseMessage<InstanceType<typeof User>>> {
    const updateUserData = await User.findByIdAndUpdate(
      { _id: new ObjectId(userId) },
      {
        ...updateData,
        dateOfBirth: new Date(updateData.dateOfBirth)
      },
      { new: true }
    )
    return {
      success: true,
      code: HTTP_STATUS.OK,
      message: userMessages.UPDATE_USER_SUCCESS,
      data: updateUserData as InstanceType<typeof User>
    }
  }
}
const userService = new UserService()
export default userService
