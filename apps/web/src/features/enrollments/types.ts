export type EnrollmentStatus = "ACTIVE" | "LEFT" | "FINISHED"

export type Enrollment = {
  id: string
  studentId: string
  groupId: string
  startDate: string
  endDate?: string | null
  status: EnrollmentStatus
  createdAt: string
  updatedAt: string
  student?: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone?: string | null
  }
  group?: {
    id: string
    title?: string | null
    scheduleText: string
    course?: { id: string; title: string }
    teacher?: { id: string; fullName?: string | null; email: string }
  }
}

export type CreateEnrollmentInput = {
  studentId: string
  startDate: string
}

export type UpdateEnrollmentInput = {
  status?: EnrollmentStatus
  endDate?: string
}

export type GroupEnrollmentsResponse = {
  items: Enrollment[]
  total: number
  page: number
  pageSize: number
}
