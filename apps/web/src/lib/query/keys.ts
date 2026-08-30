export const queryKeys = {
  students: {
    root: ["students"] as const,
    list: (filters?: Record<string, unknown>) =>
      ["students", "list", filters ?? {}] as const,
    detail: (id: string) => ["students", "detail", id] as const,
  },
  courses: {
    root: ["courses"] as const,
    list: (filters?: Record<string, unknown>) =>
      ["courses", "list", filters ?? {}] as const,
    detail: (id: string) => ["courses", "detail", id] as const,
  },
  staff: {
    root: ["staff"] as const,
    list: (filters?: Record<string, unknown>) =>
      ["staff", "list", filters ?? {}] as const,
    detail: (id: string) => ["staff", "detail", id] as const,
  },
  groups: {
    root: ["groups"] as const,
    list: (filters?: Record<string, unknown>) =>
      ["groups", "list", filters ?? {}] as const,
    detail: (id: string) => ["groups", "detail", id] as const,
  },
  enrollments: {
    root: ["enrollments"] as const,
    group: (groupId: string, filters?: Record<string, unknown>) =>
      ["enrollments", "group", groupId, filters ?? {}] as const,
    student: (studentId: string) =>
      ["enrollments", "student", studentId] as const,
  },
  attendance: {
    root: ["attendance"] as const,
    myGroups: (date: string) => ["attendance", "my-groups", date] as const,
    session: (groupId: string, date: string) =>
      ["attendance", "session", groupId, date] as const,
    history: (filters?: Record<string, unknown>) =>
      ["attendance", "history", filters ?? {}] as const,
    sessionDetail: (id: string) =>
      ["attendance", "session-detail", id] as const,
  },
  dashboard: {
    root: ["dashboard"] as const,
    stats: () => ["dashboard", "stats"] as const,
    recentAttendance: () => ["dashboard", "recent-attendance"] as const,
    activeGroups: () => ["dashboard", "active-groups"] as const,
  },
}
