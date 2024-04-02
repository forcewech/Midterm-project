import mongoose from 'mongoose'
import { config } from 'dotenv'
import { MONGO_URL } from './env-config'
config()
class DatabaseService {
  constructor() {
    this.connect()
  }
  connect(): void {
    mongoose
      .connect(MONGO_URL)
      .then(() => {
        console.log('Database connection successfully')
      })
      .catch((err) => {
        console.error('Database connection error')
      })
  }
}

const databaseService = new DatabaseService()
export default databaseService
