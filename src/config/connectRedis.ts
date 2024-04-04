import { createClient } from 'redis'

export const client = createClient({
  password: 'hvs2GvCEZHKKP7daZMsBtz09WEwKainm',
  socket: {
    host: 'redis-16228.c299.asia-northeast1-1.gce.cloud.redislabs.com',
    port: 16228
  }
})
export const connectRedis = async () => {
  await client.connect()
}
