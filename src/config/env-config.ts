import { config } from 'dotenv'
config()

export const MONGO_URL: string = process.env.MONGO_URL as string
export const PORT: string = process.env.PORT as string
export const JWT_SECRET_ACCESS_TOKEN: string = process.env.JWT_SECRET_ACCESS_TOKEN as string
export const JWT_SECRET_REFRESH_TOKEN: string = process.env.JWT_SECRET_REFRESH_TOKEN as string
export const ACCESS_TOKEN_EXPIRES_IN: string = process.env.ACCESS_TOKEN_EXPIRES_IN as string
export const REFRESH_TOKEN_EXPIRES_IN: string = process.env.REFRESH_TOKEN_EXPIRES_IN as string
export const INVITE_SECRET_KEY: string = process.env.INVITE_SECRET_KEY as string
export const INVITE_TOKEN_EXPIRES_IN: string = process.env.INVITE_TOKEN_EXPIRES_IN as string
