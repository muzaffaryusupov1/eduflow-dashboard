"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AttendanceHistoryTable } from "@/features/attendance/components/attendance-history-table"
import { useAttendanceHistory } from "@/features/attendance/queries"
import { useGroups } from "@/features/groups/queries"
import { useTeachersOptions } from "@/features/staff/queries"

export default function AttendanceHistoryPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [groupId, setGroupId] = useState("")
  const [teacherId, setTeacherId] = useState("")

  const canView = user?.role === "OWNER" || user?.role === "ADMIN"

  const historyQuery = useAttendanceHistory(
    {
      page,
      pageSize,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      groupId: groupId || undefined,
      teacherId: teacherId || undefined,
    },
    canView
  )

  const groupsQuery = useGroups({ page: 1, pageSize: 100 }, canView)
  const teachers = useTeachersOptions(canView)

  const groups = useMemo(() => groupsQuery.data?.items ?? [], [groupsQuery.data])

  if (!canView) {
    return (
      <Card>
        <CardContent className="py-6 text-sm text-muted-foreground">
          Attendance history is available for admins only.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Attendance history</h2>
          <p className="text-sm text-muted-foreground">
            Review attendance sessions across groups.
          </p>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-4">
          <Input
            type="date"
            value={dateFrom}
            onChange={(event) => setDateFrom(event.target.value)}
          />
          <Input
            type="date"
            value={dateTo}
            onChange={(event) => setDateTo(event.target.value)}
          />
          <Select
            value={groupId || "all"}
            onValueChange={(value) => setGroupId(value === "all" ? "" : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All groups" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All groups</SelectItem>
              {groups.map((group) => (
                <SelectItem key={group.id} value={group.id}>
                  {group.title || `${group.course?.title ?? "Group"} • ${group.scheduleText}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={teacherId || "all"}
            onValueChange={(value) => setTeacherId(value === "all" ? "" : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All teachers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All teachers</SelectItem>
              {teachers.options.map((teacher) => (
                <SelectItem key={teacher.value} value={teacher.value}>
                  {teacher.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <AttendanceHistoryTable
        items={historyQuery.data?.items ?? []}
        page={historyQuery.data?.page ?? page}
        pageSize={historyQuery.data?.pageSize ?? pageSize}
        total={historyQuery.data?.total ?? 0}
        isLoading={historyQuery.isLoading}
        isError={historyQuery.isError}
        onPageChange={setPage}
        onRowClick={(id) => router.push(`/attendance/history/${id}`)}
      />
    </div>
  )
}
