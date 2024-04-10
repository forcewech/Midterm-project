import { ObjectId } from 'mongodb'
import mongoose, { Schema } from 'mongoose'

const inviteIdSchema = new Schema({
  code: {
    type: String,
    unique: true,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
})
const InviteId = mongoose.model('InviteId', inviteIdSchema)

export { InviteId }
