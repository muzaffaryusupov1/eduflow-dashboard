"use client"

import { useParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useGroup } from "@/features/groups/queries"
import { useGroupEnrollments } from "@/features/enrollments/queries"
import { AddStudentToGroupDialog } from "@/features/enrollments/components/add-student-to-group-dialog"
import { GroupEnrollmentsTable } from "@/features/enrollments/components/group-enrollments-table"

export default function GroupDetailPage() {
  const params = useParams()
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id
  const { data, isLoading, isError } = useGroup(id ?? "")
  const enrollmentsQuery = useGroupEnrollments(id ?? "", { status: "ACTIVE", page: 1, pageSize: 20 })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (isError || !data) {
    return <div className="text-sm text-destructive">Group not found.</div>
  }

  const title = data.title || `${data.course?.title ?? "Group"} • ${data.scheduleText}`

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">
            {data.teacher?.fullName ?? data.teacher?.email ?? "Teacher"} •{" "}
            {new Date(data.startDate).toLocaleDateString()}
          </p>
        </div>
        <Badge variant="secondary">{data.status}</Badge>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-base font-semibold">Group info</h3>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm">
          <div>
            <span className="text-muted-foreground">Course:</span>{" "}
            {data.course?.title ?? "—"}
          </div>
          <div>
            <span className="text-muted-foreground">Teacher:</span>{" "}
            {data.teacher?.fullName ?? data.teacher?.email ?? "—"}
          </div>
          <div>
            <span className="text-muted-foreground">Schedule:</span> {data.scheduleText}
          </div>
          <div>
            <span className="text-muted-foreground">Dates:</span>{" "}
            {new Date(data.startDate).toLocaleDateString()}
            {data.endDate ? ` → ${new Date(data.endDate).toLocaleDateString()}` : ""}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-base font-semibold">Management</h3>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="students">
            <TabsList>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
            </TabsList>
            <TabsContent value="students">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Manage student enrollments for this group.
                  </div>
                  <AddStudentToGroupDialog groupId={data.id} />
                </div>
                <GroupEnrollmentsTable
                  items={enrollmentsQuery.data?.items ?? []}
                  isLoading={enrollmentsQuery.isLoading}
                  isError={enrollmentsQuery.isError}
                />
              </div>
            </TabsContent>
            <TabsContent value="attendance">
              <div className="text-sm text-muted-foreground">Attendance tracking coming soon.</div>
            </TabsContent>
            <TabsContent value="payments">
              <div className="text-sm text-muted-foreground">Payments overview coming soon.</div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
