import mongoose, { Schema } from 'mongoose'

const statusSchema = new Schema({
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

const Status = mongoose.model('Status', statusSchema)

export { Status }
