export interface IResponseMessage<T> {
  success?: boolean
  code?: number
  message?: string
  data?: T
  totalItems?: number
  totalPage?: number
  currentPage?: number
}
