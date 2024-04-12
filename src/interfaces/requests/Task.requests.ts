export interface ITaskReqBody {
  projectId: string
  name: string
  typeId: string
  priorityId: string
  statusId: string
  assignedTo: string
  startDate: string
  endDate: string
}

export interface IUpdateTask {
  projectId?: string
  name?: string
  typeId?: string
  priorityId?: string
  statusId?: string
  assignedTo?: string
  startDate?: string
  endDate?: string
}
