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
  isHidden: {
    type: Boolean,
    default: true
  }
})
const Type = mongoose.model('Type', typeSchema)

export default Type
