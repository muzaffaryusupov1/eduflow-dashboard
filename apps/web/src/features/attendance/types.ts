export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE"

export type StudentLite = {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
}

export type UserLite = {
  id: string
  fullName?: string | null
  email?: string | null
}

export type CourseLite = {
  id: string
  title: string
}

export type GroupLite = {
  id: string
  title?: string | null
  scheduleText: string
  course?: CourseLite | null
  teacher?: UserLite | null
}

export type AttendanceRecord = {
  id?: string
  studentId: string
  status: AttendanceStatus
  note?: string | null
  student?: StudentLite
}

export type AttendanceSession = {
  id: string
  groupId: string
  date: string
  takenByUserId: string
  records?: AttendanceRecord[]
  group?: GroupLite
  takenBy?: UserLite
}

export type AttendanceSessionResponse = {
  group: GroupLite
  date: string
  session: AttendanceSession | null
  students: StudentLite[]
}

export type AttendanceMyGroup = GroupLite & {
  hasSession: boolean
  sessionId?: string | null
}

export type AttendanceHistoryItem = AttendanceSession & {
  presentCount: number
  absentCount: number
  lateCount: number
}

export type AttendanceHistoryResponse = {
  items: AttendanceHistoryItem[]
  total: number
  page: number
  pageSize: number
}

export type AttendanceSessionDetail = AttendanceSession

export type SaveAttendanceInput = {
  groupId: string
  date: string
  records: Array<{
    studentId: string
    status: AttendanceStatus
    note?: string
  }>
}

export type AttendanceHistoryFilters = {
  dateFrom?: string
  dateTo?: string
  groupId?: string
  teacherId?: string
  page?: number
  pageSize?: number
}
