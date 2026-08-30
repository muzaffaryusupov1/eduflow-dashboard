import { httpClient } from "@/lib/http/client"
import type { ActiveGroupItem, DashboardStats, RecentAttendanceItem } from "./types"

export async function fetchDashboardStats() {
  return httpClient<DashboardStats>(`/dashboard/stats`)
}

export async function fetchRecentAttendance() {
  return httpClient<RecentAttendanceItem[]>(`/dashboard/recent-attendance`)
}

export async function fetchActiveGroups() {
  return httpClient<ActiveGroupItem[]>(`/dashboard/active-groups`)
}
