import mongoose, { Schema } from 'mongoose'

const prioritySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  isHidden: {
    type: Boolean,
    default: false
  }
})
const Priority = mongoose.model('Priority', prioritySchema)

export default Priority
