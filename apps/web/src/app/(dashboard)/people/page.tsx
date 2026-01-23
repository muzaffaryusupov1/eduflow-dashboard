'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from '@/components/ui/separator'
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StudentFormDialog } from "@/features/students/components/student-form-dialog"
import { useStudents } from "@/features/students/queries"
import type { Student } from "@/features/students/types"
import { useMemo, useState } from "react"

export default function PeoplePage() {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [q] = useState<string | undefined>(undefined)
  const { data, isLoading, isError, refetch, isFetching } = useStudents({ page, limit, q })

  const rows = useMemo(() => data?.data ?? [], [data])
  const total = data?.meta.total ?? 0
  const pageSize = data?.meta.limit ?? limit
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const canPrev = page > 1
  const canNext = page < totalPages

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Students</h2>
          <p className="text-sm text-muted-foreground">
            Manage student profiles and contact details.
          </p>
        </div>
        <StudentFormDialog mode="create" trigger={<Button variant="secondary">Add student</Button>} />
      </div>

      <Card className='p-0 gap-0'>
        <CardHeader className="px-4 py-3">
          <div className="flex items-center justify-between p-0">
            <p className="text-sm text-muted-foreground">
              Page {data?.meta.page ?? page} of {totalPages} · {total} total
            </p>
            <Button variant="ghost" size="sm" onClick={() => refetch()} disabled={isFetching}>
              {isFetching ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </CardHeader>
        <Separator decorative />
        <CardContent className="p-0">
          {isError ? (
            <div className="p-6 text-sm text-destructive">
              Failed to load students. Please try again.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <>
                    {[1, 2, 3].map((row) => (
                      <TableRow key={row}>
                        <TableCell>
                          <Skeleton className="h-4 w-32" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-48" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-16" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                )}
                {!isLoading && rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="py-8 text-center text-sm text-muted-foreground">
                      No students yet.
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading &&
                  rows.map((student: Student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        {student.firstName} {student.lastName}
                      </TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell className="flex items-center gap-2">
                        <span>{student.isActive ? "Active" : "Inactive"}</span>
                        <StudentFormDialog
                          mode="edit"
                          student={student}
                          trigger={
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
          <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground">
            <div>
              Showing {(page - 1) * pageSize + (rows.length ? 1 : 0)}-
              {(page - 1) * pageSize + rows.length} of {total}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!canPrev || isFetching}
              >
                Previous
              </Button>
              <span className="text-xs text-muted-foreground">
                Page {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={!canNext || isFetching}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
