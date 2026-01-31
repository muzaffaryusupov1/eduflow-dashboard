"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { GroupFormDialog } from "@/features/groups/components/group-form-dialog"
import { GroupsTable } from "@/features/groups/components/groups-table"
import { useGroups } from "@/features/groups/queries"
import { useCourses } from "@/features/courses/queries"
import { useTeachersOptions } from "@/features/staff/queries"

export default function ClassesPage() {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [search, setSearch] = useState("")
  const [debounced, setDebounced] = useState("")
  const [courseId, setCourseId] = useState("")
  const [teacherId, setTeacherId] = useState("")
  const [status, setStatus] = useState("")

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 300)
    return () => clearTimeout(t)
  }, [search])

  const groupsQuery = useGroups({
    page,
    pageSize,
    q: debounced || undefined,
    courseId: courseId || undefined,
    teacherId: teacherId || undefined,
    status: status ? (status as "ACTIVE" | "PAUSED" | "FINISHED") : undefined,
  })

  const coursesQuery = useCourses({ page: 1, limit: 100 })
  const teachers = useTeachersOptions()

  const groups = useMemo(() => groupsQuery.data?.items ?? [], [groupsQuery.data])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Groups</h2>
            <p className="text-sm text-muted-foreground">
              Manage classes, schedules, and teacher assignments.
            </p>
          </div>
          <GroupFormDialog mode="create" trigger={<Button variant="secondary">New group</Button>} />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 lg:grid-cols-4">
            <Input
              placeholder="Search groups..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
            >
              <option value="">All courses</option>
              {coursesQuery.data?.data.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
            >
              <option value="">All teachers</option>
              {teachers.options.map((teacher) => (
                <option key={teacher.value} value={teacher.value}>
                  {teacher.label}
                </option>
              ))}
            </select>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="PAUSED">Paused</option>
              <option value="FINISHED">Finished</option>
            </select>
          </div>

          <GroupsTable
            groups={groups}
            page={groupsQuery.data?.page ?? page}
            pageSize={groupsQuery.data?.pageSize ?? pageSize}
            total={groupsQuery.data?.total ?? 0}
            isLoading={groupsQuery.isLoading}
            isError={groupsQuery.isError}
            onPageChange={setPage}
            onRefresh={() => groupsQuery.refetch()}
            onRowClick={(id) => router.push(`/classes/${id}`)}
          />
        </CardContent>
      </Card>
    </div>
  )
}
