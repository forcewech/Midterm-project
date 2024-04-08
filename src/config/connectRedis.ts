import { createClient } from 'redis'
import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from './env-config'

export const client = createClient({
  password: REDIS_PASSWORD,
  socket: {
    host: REDIS_HOST,
    port: Number(REDIS_PORT)
  }
})
export const connectRedis = async (): Promise<void> => {
  await client.connect()
}
