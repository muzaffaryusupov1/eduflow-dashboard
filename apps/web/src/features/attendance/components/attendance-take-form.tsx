"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { attendanceSessionSchema } from "@/features/attendance/schema"
import { useAttendanceSession, useSaveAttendanceSession } from "@/features/attendance/queries"
import type { AttendanceStatus } from "@/features/attendance/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const statusOptions: AttendanceStatus[] = ["PRESENT", "ABSENT", "LATE"]

type AttendanceTakeFormProps = {
  groupId: string
  date: string
}

export function AttendanceTakeForm({ groupId, date }: AttendanceTakeFormProps) {
  const sessionQuery = useAttendanceSession(groupId, date)
  const saveMutation = useSaveAttendanceSession()
  const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>({})

  const students = useMemo(() => sessionQuery.data?.students ?? [], [sessionQuery.data])

  useEffect(() => {
    if (!sessionQuery.data) return
    const next: Record<string, AttendanceStatus> = {}
    for (const student of sessionQuery.data.students) {
      const existing = sessionQuery.data.session?.records.find(
        (record) => record.studentId === student.id
      )
      next[student.id] = (existing?.status as AttendanceStatus) ?? "PRESENT"
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatuses(next)
  }, [sessionQuery.data])

  const handleSave = async () => {
    const payload = {
      groupId,
      date,
      records: students.map((student) => ({
        studentId: student.id,
        status: statuses[student.id] ?? "PRESENT",
      })),
    }

    const parsed = attendanceSessionSchema.safeParse(payload)
    if (!parsed.success) {
      toast.error("Please fill all attendance statuses.")
      return
    }

    try {
      await saveMutation.mutateAsync(parsed.data)
      toast.success("Attendance saved")
    } catch {
      toast.error("Failed to save attendance")
    }
  }

  if (sessionQuery.isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (sessionQuery.isError || !sessionQuery.data) {
    return (
      <Card>
        <CardContent className="py-6 text-sm text-destructive">
          Failed to load attendance session.
        </CardContent>
      </Card>
    )
  }

  const groupTitle =
    sessionQuery.data.group.title ||
    `${sessionQuery.data.group.course?.title ?? "Group"} • ${sessionQuery.data.group.scheduleText}`

  if (students.length === 0) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-base font-semibold">{groupTitle}</h3>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          No active students for this group.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold">{groupTitle}</h3>
          <p className="text-sm text-muted-foreground">Attendance for {date}</p>
        </div>
        <Button onClick={handleSave} disabled={saveMutation.isPending}>
          {saveMutation.isPending ? "Saving..." : "Save attendance"}
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="w-48">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">
                  {student.firstName} {student.lastName}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {student.phone || "—"}
                </TableCell>
                <TableCell>
                  <Select
                    value={statuses[student.id] ?? "PRESENT"}
                    onValueChange={(value) =>
                      setStatuses((prev) => ({
                        ...prev,
                        [student.id]: value as AttendanceStatus,
                      }))
                    }
                  >
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
