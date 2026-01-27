"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CoursesTable } from "@/features/courses/components/courses-table"
import { CourseFormDialog } from "@/features/courses/components/course-form-dialog"
import { useCourses } from "@/features/courses/queries"

export default function ClassesPage() {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350)
    return () => clearTimeout(t)
  }, [search])

  const { data, isLoading, isError, refetch, isFetching } = useCourses({
    page,
    limit,
    q: debouncedSearch || undefined,
  })

  const courses = useMemo(() => data?.data ?? [], [data])
  const total = data?.meta.total ?? 0

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Courses</h2>
            <p className="text-sm text-muted-foreground">
              Manage course catalog, pricing, and availability.
            </p>
          </div>
          <CourseFormDialog mode="create" trigger={<Button variant="secondary">New course</Button>} />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Input
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="sm:max-w-xs"
            />
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {isFetching ? "Updating list..." : null}
            </div>
          </div>
          <CoursesTable
            courses={courses}
            page={data?.meta.page ?? page}
            limit={data?.meta.limit ?? limit}
            total={total}
            isLoading={isLoading}
            isError={isError}
            onPageChange={(p) => setPage(p)}
            onRefresh={() => refetch()}
          />
        </CardContent>
      </Card>
    </div>
  )
}
