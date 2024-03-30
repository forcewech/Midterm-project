import mongoose, { Schema } from 'mongoose'

const taskSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  status: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Status',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Type'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})
const Task = mongoose.model('Task', taskSchema)

export default Task
