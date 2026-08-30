"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCourses } from "@/features/courses/queries"
import { GroupFormDialog } from "@/features/groups/components/group-form-dialog"
import { GroupsTable } from "@/features/groups/components/groups-table"
import { useGroups } from "@/features/groups/queries"
import { useTeachersOptions } from "@/features/staff/queries"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

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
    courseId: courseId === "all-courses" ? undefined : courseId || undefined,
    teacherId: teacherId === "all-teachers" ? undefined : teacherId || undefined,
    status: status === "all" ? undefined : (status as "ACTIVE" | "PAUSED" | "FINISHED"),
  })

  const coursesQuery = useCourses({ page: 1, limit: 100 })
  const teachers = useTeachersOptions()

  const groups = useMemo(() => groupsQuery.data?.items ?? [], [groupsQuery.data])

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold">Groups</h2>
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
            <Select value={courseId} onValueChange={setCourseId}>
              <SelectTrigger>
                <SelectValue placeholder="All courses" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Courses</SelectLabel>
                  <SelectItem value="all-courses">All courses</SelectItem>
                  {coursesQuery.data?.data.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select value={teacherId} onValueChange={setTeacherId}>
              <SelectTrigger>
                <SelectValue placeholder="All teachers" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Teachers</SelectLabel>
                  <SelectItem value="all-teachers">All teachers</SelectItem>
                  {teachers.options.map((teacher) => (
                    <SelectItem key={teacher.value} value={teacher.value}>
                      {teacher.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
               <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Statuses</SelectLabel>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="PAUSED">Paused</SelectItem>
                  <SelectItem value="FINISHED">Finished</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
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
