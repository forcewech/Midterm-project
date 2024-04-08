import bodyParser from 'body-parser'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { connectRedis } from './config/connectRedis'
import databaseService from './config/database'
import { PORT } from './config/env-config'
import { customErrorHandler } from './middlewares/error.middlewares'
import authRouter from './routes/auth.routes'
import priorityRouter from './routes/priority.routes'
import projectRouter from './routes/project.routes'
import statusRouter from './routes/status.routes'
import typeRouter from './routes/type.routes'
import userRouter from './routes/user.routes'
import taskRouter from './routes/task.routes'

const app = express()
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
connectRedis()

//routing
app.use('/v1/auth', authRouter)
app.use('/v1/projects', projectRouter)
app.use('/v1/users', userRouter)
app.use('/v1/types', typeRouter)
app.use('/v1/status', statusRouter)
app.use('/v1/priorities', priorityRouter)
app.use('/v1/tasks', taskRouter)

//Handle error
app.use(customErrorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
