import mongoose, { Schema } from 'mongoose'

const projectSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String || null || undefined
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
})
const Project = mongoose.model('Project', projectSchema)

export { Project }
