import { httpClient } from "@/lib/http/client"
import type {
  AttendanceHistoryFilters,
  AttendanceHistoryResponse,
  AttendanceMyGroup,
  AttendanceSessionDetail,
  AttendanceSessionResponse,
  SaveAttendanceInput,
} from "./types"

export async function fetchAttendanceMyGroups(date: string) {
  const params = new URLSearchParams()
  if (date) params.set("date", date)
  const query = params.toString()
  return httpClient<AttendanceMyGroup[]>(
    `/attendance/my-groups${query ? `?${query}` : ""}`
  )
}

export async function fetchAttendanceSession(groupId: string, date: string) {
  const params = new URLSearchParams()
  params.set("groupId", groupId)
  params.set("date", date)
  return httpClient<AttendanceSessionResponse>(`/attendance/session?${params}`)
}

export async function saveAttendanceSession(input: SaveAttendanceInput) {
  return httpClient<{ session: { id: string } }>(`/attendance/session`, {
    method: "POST",
    body: input,
  })
}

export async function fetchAttendanceHistory(filters: AttendanceHistoryFilters = {}) {
  const params = new URLSearchParams()
  if (filters.dateFrom) params.set("dateFrom", filters.dateFrom)
  if (filters.dateTo) params.set("dateTo", filters.dateTo)
  if (filters.groupId) params.set("groupId", filters.groupId)
  if (filters.teacherId) params.set("teacherId", filters.teacherId)
  if (filters.page) params.set("page", String(filters.page))
  if (filters.pageSize) params.set("pageSize", String(filters.pageSize))
  const query = params.toString()
  return httpClient<AttendanceHistoryResponse>(
    `/attendance/history${query ? `?${query}` : ""}`
  )
}

export async function fetchAttendanceSessionDetail(id: string) {
  return httpClient<AttendanceSessionDetail>(`/attendance/sessions/${id}`)
}
