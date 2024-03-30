import mongoose, { Schema } from 'mongoose'

const typeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  hidden: {
    type: Boolean,
    default: false
  }
})
const Type = mongoose.model('Type', typeSchema)

export default Type
