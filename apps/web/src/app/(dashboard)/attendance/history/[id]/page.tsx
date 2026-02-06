"use client"

import { useParams } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { AttendanceSessionDetail } from "@/features/attendance/components/attendance-session-detail"
import { useAttendanceSessionDetail } from "@/features/attendance/queries"

export default function AttendanceHistoryDetailPage() {
  const { user } = useAuth()
  const params = useParams()
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id
  const canView = user?.role === "OWNER" || user?.role === "ADMIN"
  const query = useAttendanceSessionDetail(id ?? "", canView)

  if (!canView) {
    return (
      <div className="text-sm text-muted-foreground">
        Attendance history is available for admins only.
      </div>
    )
  }

  return (
    <AttendanceSessionDetail
      data={query.data}
      isLoading={query.isLoading}
      isError={query.isError}
    />
  )
}
