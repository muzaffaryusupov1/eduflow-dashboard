export type GroupStatus = "ACTIVE" | "PAUSED" | "FINISHED"

export type Group = {
  id: string
  title?: string | null
  courseId: string
  teacherId: string
  scheduleText: string
  startDate: string
  endDate?: string | null
  status: GroupStatus
  createdAt: string
  updatedAt: string
  studentsCount?: number
  course?: { id: string; title: string }
  teacher?: { id: string; fullName?: string | null; email: string }
}

export type GroupsFilters = {
  page?: number
  pageSize?: number
  q?: string
  courseId?: string
  teacherId?: string
  status?: GroupStatus
}

export type GroupCreateInput = {
  title?: string | null
  courseId: string
  teacherId: string
  scheduleText: string
  startDate: string
  endDate?: string | null
  status?: GroupStatus
}

export type GroupUpdateInput = Partial<GroupCreateInput>

export type GroupsListResponse = {
  items: Group[]
  total: number
  page: number
  pageSize: number
}
