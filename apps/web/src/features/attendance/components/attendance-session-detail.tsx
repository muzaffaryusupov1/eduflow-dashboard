"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { AttendanceSessionDetail } from "../types"

type Props = {
  data?: AttendanceSessionDetail | null
  isLoading: boolean
  isError: boolean
}

export function AttendanceSessionDetail({ data, isLoading, isError }: Props) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (isError || !data) {
    return <div className="text-sm text-destructive">Failed to load session.</div>
  }

  const title =
    data.group?.title ||
    `${data.group?.course?.title ?? "Group"} • ${data.group?.scheduleText ?? ""}`

  const records = data.records ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">
            {data.group?.teacher?.fullName ?? data.group?.teacher?.email ?? "Teacher"} •{" "}
            {data.date}
          </p>
        </div>
        <Badge variant="secondary">Session</Badge>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-base font-semibold">Attendance records</h3>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="py-8 text-center text-sm text-muted-foreground">
                    No records for this session.
                  </TableCell>
                </TableRow>
              )}
              {records.map((record) => (
                <TableRow key={record.id ?? record.studentId}>
                  <TableCell className="font-medium">
                    {record.student?.firstName ?? "Student"}{" "}
                    {record.student?.lastName ?? ""}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {record.student?.phone ?? "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{record.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
