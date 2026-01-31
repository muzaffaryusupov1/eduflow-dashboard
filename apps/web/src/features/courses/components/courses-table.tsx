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
import { useUpdateCourseStatus } from "../queries"
import { Course } from "../types"
import { CourseFormDialog } from "./course-form-dialog"

type Props = {
  courses: Course[]
  page: number
  limit: number
  total: number
  isLoading: boolean
  isError: boolean
  onPageChange: (page: number) => void
  onRefresh: () => void
}

export function CoursesTable({
  courses,
  page,
  limit,
  total,
  isLoading,
  isError,
  onPageChange,
  onRefresh,
}: Props) {
  const updateStatus = useUpdateCourseStatus()

  const totalPages = Math.max(1, Math.ceil(total / limit))
  const rows = useMemo(() => courses ?? [], [courses])
  const isFetching = updateStatus.isPending
  const showingFrom = (page - 1) * limit + (rows.length ? 1 : 0)
  const showingTo = (page - 1) * limit + rows.length

  return (
    <Card className="p-0">
      <CardHeader className="px-4 py-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages} · {total} total
          </p>
          <Button variant="ghost" size="sm" onClick={onRefresh} disabled={isFetching}>
            {isFetching ? "Updating..." : "Refresh"}
          </Button>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="p-0">
        {isError ? (
          <div className="p-6 text-sm text-destructive">Failed to load courses. Please try again.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Monthly price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <>
                  {[1, 2, 3].map((row) => (
                    <TableRow key={row}>
                      <TableCell>
                        <Skeleton className="h-4 w-40" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-4 w-24 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              )}

              {!isLoading && rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                    No courses yet.
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                rows.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.title}</TableCell>
                    <TableCell>${course.monthlyPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={course.status === "ACTIVE" ? "default" : "secondary"}>
                        {course.status === "ACTIVE" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(course.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <CourseFormDialog
                        mode="edit"
                        course={course}
                        trigger={
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        }
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateStatus.mutate({
                            id: course.id,
                            status: course.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
                          })
                        }
                        disabled={updateStatus.isPending}
                      >
                        {course.status === "ACTIVE" ? "Disable" : "Enable"}
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
              disabled={page <= 1 || isFetching}
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
              disabled={page >= totalPages || isFetching}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
