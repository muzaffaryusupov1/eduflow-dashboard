"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useStudentEnrollments } from "@/features/enrollments/queries"

export default function StudentDetailPage() {
  const params = useParams()
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id
  const { data, isLoading, isError } = useStudentEnrollments(id ?? "")

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (isError) {
    return <div className="text-sm text-destructive">Failed to load student enrollments.</div>
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue="groups">
        <TabsList>
          <TabsTrigger value="groups">Groups</TabsTrigger>
        </TabsList>
        <TabsContent value="groups">
          <Card>
            <CardHeader>
              <h3 className="font-display text-base font-semibold">Group history</h3>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {(data ?? []).length === 0 && (
                <div className="text-muted-foreground">No enrollments yet.</div>
              )}
              {(data ?? []).map((enrollment) => (
                <div key={enrollment.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">
                      {enrollment.group?.course?.title ?? "Group"} • {enrollment.group?.scheduleText}
                    </div>
                    <div className="text-muted-foreground">
                      Teacher: {enrollment.group?.teacher?.fullName ?? enrollment.group?.teacher?.email ?? "—"}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(enrollment.startDate).toLocaleDateString()}
                    {enrollment.endDate ? ` → ${new Date(enrollment.endDate).toLocaleDateString()}` : ""}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
