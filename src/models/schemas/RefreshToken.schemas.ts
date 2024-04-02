import mongoose, { Schema } from 'mongoose'

const refreshTokenSchema = new Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
})

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema)

export default RefreshToken
