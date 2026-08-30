import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "@/lib/query/keys"
import { fetchActiveGroups, fetchDashboardStats, fetchRecentAttendance } from "./api"

export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboard.stats(),
    queryFn: fetchDashboardStats,
  })
}

export function useRecentAttendance() {
  return useQuery({
    queryKey: queryKeys.dashboard.recentAttendance(),
    queryFn: fetchRecentAttendance,
  })
}

export function useActiveGroups() {
  return useQuery({
    queryKey: queryKeys.dashboard.activeGroups(),
    queryFn: fetchActiveGroups,
  })
}
