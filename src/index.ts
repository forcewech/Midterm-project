import express from 'express'
import cors from 'cors'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import databaseService from './config/database'
import authRouter from './routes/auth.routes'
import { customErrorHandler } from './middlewares/error.middlewares'
import projectRouter from './routes/project.routes'

const app = express()
const port = 8000
//Midlleware app
app.use(
  cors({
    credentials: true
  })
)
app.use(compression())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))
//Conect database
databaseService
//routing
app.use('/auth', authRouter)
app.use('/project', projectRouter)
//Handle error
app.use(customErrorHandler)
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
