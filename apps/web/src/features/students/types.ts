export type Student = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string | null
  isActive: boolean
  createdAt: string
}

export type StudentsFilters = {
  page?: number
  limit?: number
  q?: string
  status?: 'active' | 'inactive'
}

export type StudentCreateInput = {
  firstName: string
  lastName: string
  email: string
  phone?: string | null
}

export type StudentUpdateInput = Partial<StudentCreateInput> & {
  isActive?: boolean
}

export type StudentsListResponse = {
  data: Student[]
  meta: {
    page: number
    limit: number
    total: number
  }
}
