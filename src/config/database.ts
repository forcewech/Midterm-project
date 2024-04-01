import mongoose from 'mongoose'
import { config } from 'dotenv'
config()
class DatabaseService {
  constructor() {
    this.connect()
  }
  connect(): void {
    mongoose
      .connect(process.env.MONGO_URL as string)
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
