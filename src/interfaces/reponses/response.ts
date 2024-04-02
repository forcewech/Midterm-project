export interface IResponseMessage<T> {
  success: boolean
  code: number
  message: string
  data?: T
}
