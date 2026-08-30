export interface DashboardStats {
  activeStudents: number
  activeGroups: number
  activeCourses: number
  todaySessions: number
}

export interface RecentAttendanceItem {
  id: string
  date: string
  groupId: string
  groupTitle: string | null
  courseTitle: string
  teacherName: string
  presentCount: number
  absentCount: number
  lateCount: number
}

export interface ActiveGroupItem {
  id: string
  title: string | null
  scheduleText: string
  courseTitle: string
  teacherName: string
  studentsCount: number
}
