export type CourseStatus = 'ACTIVE' | 'INACTIVE'

export type Course = {
  id: string
  title: string
  monthlyPrice: number
  status: CourseStatus
  createdAt: string
  updatedAt: string
}

export type CoursesFilters = {
  page?: number
  limit?: number
  q?: string
  status?: CourseStatus
}

export type CourseCreateInput = {
  title: string
  monthlyPrice: number
  status?: CourseStatus
}

export type CourseUpdateInput = Partial<CourseCreateInput>

export type CoursesListResponse = {
  data: Course[]
  meta: {
    page: number
    limit: number
    total: number
  }
}
