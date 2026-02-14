"use client"

import { useAuth } from "@/components/auth-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { AttendanceTakeForm } from "@/features/attendance/components/attendance-take-form"
import { useAttendanceMyGroups } from "@/features/attendance/queries"
import { useMemo, useState } from "react"

function todayString() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, "0")
  const day = String(today.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export default function AttendancePage() {
  const { user } = useAuth()
  const [date, setDate] = useState(todayString())
  const [selectedGroupId, setSelectedGroupId] = useState<string>("")
  const canTake = user?.role === "TEACHER"
  const groupsQuery = useAttendanceMyGroups(date, canTake)

  const groups = useMemo(() => groupsQuery.data ?? [], [groupsQuery.data])

  if (!canTake) {
    return (
      <Card>
        <CardContent className="py-6 text-sm text-muted-foreground">
          Attendance is available for teachers only.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Take attendance</h2>
            <p className="text-sm text-muted-foreground">
              Select a date and a group to mark attendance.
            </p>
          </div>
          <div className="w-full sm:w-auto">
            <Input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {groupsQuery.isLoading && (
            <div className="grid gap-3 md:grid-cols-2">
              {[1, 2].map((row) => (
                <Skeleton key={row} className="h-24 w-full" />
              ))}
            </div>
          )}
          {groupsQuery.isError && (
            <div className="text-sm text-destructive">Failed to load your groups.</div>
          )}
          {!groupsQuery.isLoading && groups.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="py-6 text-sm text-muted-foreground">
                No groups assigned to you yet.
              </CardContent>
            </Card>
          )}
          {!groupsQuery.isLoading && groups.length > 0 && (
            <div className="grid gap-3 md:grid-cols-2">
              {groups.map((group) => {
                const title =
                  group.title ||
                  `${group.course?.title ?? "Group"} • ${group.scheduleText}`
                const active = selectedGroupId === group.id
                return (
                  <Card key={group.id} className={active ? "border-primary" : ""}>
                    <CardContent className="flex items-center justify-between gap-3 py-4">
                      <div>
                        <p className="font-medium">{title}</p>
                        <p className="text-sm text-muted-foreground">
                          {group.course?.title ?? "Course"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {group.hasSession && <Badge variant="secondary">Taken</Badge>}
                        <Button
                          size="sm"
                          variant={active ? "default" : "outline"}
                          onClick={() => setSelectedGroupId(group.id)}
                        >
                          {active ? "Selected" : "Take"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedGroupId && <AttendanceTakeForm groupId={selectedGroupId} date={date} />}
    </div>
  )
}
