import express from 'express'
import cors from 'cors'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import databaseService from './config/database'

const app = express()
const port = 3000
//Midlleware app
app.use(
  cors({
    credentials: true
  })
)
app.use(compression())
app.use(cookieParser())
app.use(bodyParser.json())
//Conect database
databaseService

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
