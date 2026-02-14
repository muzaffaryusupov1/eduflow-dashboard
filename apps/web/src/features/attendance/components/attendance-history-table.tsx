import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { AttendanceHistoryItem } from "../types"

type Props = {
  items: AttendanceHistoryItem[]
  page: number
  pageSize: number
  total: number
  isLoading: boolean
  isError: boolean
  onPageChange: (page: number) => void
  onRowClick: (id: string) => void
}

export function AttendanceHistoryTable({
  items,
  page,
  pageSize,
  total,
  isLoading,
  isError,
  onPageChange,
  onRowClick,
}: Props) {
  const rows = useMemo(() => items ?? [], [items])
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const showingFrom = (page - 1) * pageSize + (rows.length ? 1 : 0)
  const showingTo = (page - 1) * pageSize + rows.length

  return (
    <Card className="p-0">
      <CardHeader className="px-4 py-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages} · {total} total
          </p>
          <Badge variant="secondary">History</Badge>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="p-0">
        {isError ? (
          <div className="p-6 text-sm text-destructive">Failed to load attendance history.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Group</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Present</TableHead>
                <TableHead>Absent</TableHead>
                <TableHead>Late</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <>
                  {[1, 2, 3].map((row) => (
                    <TableRow key={row}>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-28" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-12" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-12" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-12" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-4 w-20 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              )}
              {!isLoading && rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                    No attendance history yet.
                  </TableCell>
                </TableRow>
              )}
              {!isLoading &&
                rows.map((session) => (
                  <TableRow key={session.id} className="cursor-pointer">
                    <TableCell onClick={() => onRowClick(session.id)}>
                      {session.date}
                    </TableCell>
                    <TableCell onClick={() => onRowClick(session.id)}>
                      {session.group?.title ??
                        `${session.group?.course?.title ?? "Group"} • ${
                          session.group?.scheduleText ?? ""
                        }`}
                    </TableCell>
                    <TableCell onClick={() => onRowClick(session.id)}>
                      {session.group?.teacher?.fullName ??
                        session.group?.teacher?.email ??
                        "—"}
                    </TableCell>
                    <TableCell onClick={() => onRowClick(session.id)}>
                      {session.presentCount}
                    </TableCell>
                    <TableCell onClick={() => onRowClick(session.id)}>
                      {session.absentCount}
                    </TableCell>
                    <TableCell onClick={() => onRowClick(session.id)}>
                      {session.lateCount}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRowClick(session.id)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}
        <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground">
          <div>
            Showing {showingFrom}-{showingTo} of {total}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page <= 1}
            >
              Previous
            </Button>
            <span className="text-xs text-muted-foreground">
              Page {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
