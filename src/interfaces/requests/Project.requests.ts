export interface IProjectReqBody {
  name: string
  startDate: string
  endDate: string
}

export interface IUpdateProject {
  name?: string
  startDate?: string
  endDate?: string
}
