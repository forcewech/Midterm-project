import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema({
  name: {
    type: String
  },
  userName: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  inviteid: {
    type: String
  },
  dateOfBirth: {
    type: Date,
    default: new Date()
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'inactive'
  },
  projects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project'
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: null
  }
})
const User = mongoose.model('User', userSchema)

export default User
