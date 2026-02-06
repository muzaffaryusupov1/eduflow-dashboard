import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/query/keys"
import {
  fetchAttendanceHistory,
  fetchAttendanceMyGroups,
  fetchAttendanceSession,
  fetchAttendanceSessionDetail,
  saveAttendanceSession,
} from "./api"
import type { AttendanceHistoryFilters, SaveAttendanceInput } from "./types"

export function useAttendanceMyGroups(date: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.attendance.myGroups(date),
    queryFn: () => fetchAttendanceMyGroups(date),
    enabled: Boolean(date) && enabled,
  })
}

export function useAttendanceSession(groupId: string, date: string) {
  return useQuery({
    queryKey: queryKeys.attendance.session(groupId, date),
    queryFn: () => fetchAttendanceSession(groupId, date),
    enabled: Boolean(groupId && date),
  })
}

export function useSaveAttendanceSession() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: SaveAttendanceInput) => saveAttendanceSession(input),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: queryKeys.attendance.session(variables.groupId, variables.date) })
      qc.invalidateQueries({ queryKey: queryKeys.attendance.history() })
    },
  })
}

export function useAttendanceHistory(filters: AttendanceHistoryFilters, enabled = true) {
  return useQuery({
    queryKey: queryKeys.attendance.history(filters),
    queryFn: () => fetchAttendanceHistory(filters),
    enabled,
  })
}

export function useAttendanceSessionDetail(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.attendance.sessionDetail(id),
    queryFn: () => fetchAttendanceSessionDetail(id),
    enabled: Boolean(id) && enabled,
  })
}
