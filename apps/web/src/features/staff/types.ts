export type StaffUser = {
  id: string
  fullName?: string | null
  email: string
  phone?: string | null
  role: "TEACHER"
  isActive: boolean
  createdAt: string
}

export type StaffFilters = {
  page?: number
  pageSize?: number
  q?: string
}

export type CreateStaffInput = {
  fullName: string
  email: string
  phone?: string | null
  password?: string
}

export type UpdateStaffInput = Partial<CreateStaffInput>

export type StaffListResponse = {
  data: StaffUser[]
  meta: {
    page: number
    pageSize: number
    total: number
  }
}
