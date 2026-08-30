"use client"

import Link from "next/link"
import { BookOpen, CalendarCheck, GraduationCap, Users } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  useActiveGroups,
  useDashboardStats,
  useRecentAttendance,
} from "@/features/dashboard/queries"

export default function DashboardPage() {
  const stats = useDashboardStats()
  const recent = useRecentAttendance()
  const activeGroups = useActiveGroups()

  const kpis = [
    {
      label: "Students",
      value: stats.data?.activeStudents,
      icon: Users,
    },
    {
      label: "Groups",
      value: stats.data?.activeGroups,
      icon: GraduationCap,
    },
    {
      label: "Courses",
      value: stats.data?.activeCourses,
      icon: BookOpen,
    },
    {
      label: "Today's sessions",
      value: stats.data?.todaySessions,
      icon: CalendarCheck,
    },
  ]

  return (
    <div className="space-y-10">
      <section className="space-y-2">
        <h2 className="font-display text-2xl font-bold tracking-tight">
          Welcome back
        </h2>
        <p className="text-sm text-muted-foreground">
          Track your center activity at a glance.
        </p>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <Card key={kpi.label}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {kpi.label}
                  </p>
                  <Icon className="size-4 text-muted-foreground" aria-hidden />
                </div>
              </CardHeader>
              <CardContent>
                {stats.isLoading ? (
                  <Skeleton className="h-9 w-16" />
                ) : (
                  <p className="font-display text-3xl font-bold tracking-tight">
                    {kpi.value ?? 0}
                  </p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </section>

      <section className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <h3 className="font-display text-lg font-semibold">
              Recent attendance
            </h3>
            <p className="text-sm text-muted-foreground">
              Latest sessions taken across your groups.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {recent.isLoading ? (
              [1, 2, 3].map((row) => (
                <div
                  key={row}
                  className="flex items-center justify-between rounded-xl bg-accent/50 p-4"
                >
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                </div>
              ))
            ) : recent.data && recent.data.length > 0 ? (
              recent.data.map((session) => (
                <Link
                  key={session.id}
                  href={`/attendance/history/${session.id}`}
                  className="flex items-center justify-between rounded-xl bg-accent/50 p-4 transition hover:bg-accent"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {session.groupTitle ?? session.courseTitle}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {session.courseTitle} · {session.teacherName} · {session.date}
                    </p>
                  </div>
                  <div className="flex gap-2 text-xs font-medium">
                    <span className="rounded-md bg-emerald-100 px-2 py-1 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      {session.presentCount}P
                    </span>
                    <span className="rounded-md bg-amber-100 px-2 py-1 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                      {session.lateCount}L
                    </span>
                    <span className="rounded-md bg-rose-100 px-2 py-1 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                      {session.absentCount}A
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <p className="rounded-xl bg-accent/50 p-4 text-sm text-muted-foreground">
                No attendance recorded yet.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-display text-lg font-semibold">Active groups</h3>
            <p className="text-sm text-muted-foreground">
              Recently created groups in your center.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeGroups.isLoading ? (
              [1, 2, 3].map((row) => (
                <div key={row} className="rounded-xl bg-accent/50 p-4">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="mt-2 h-3 w-24" />
                </div>
              ))
            ) : activeGroups.data && activeGroups.data.length > 0 ? (
              activeGroups.data.map((group) => (
                <Link
                  key={group.id}
                  href={`/classes/${group.id}`}
                  className="block rounded-xl bg-accent/50 p-4 transition hover:bg-accent"
                >
                  <p className="text-sm font-medium">
                    {group.title ?? group.courseTitle}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {group.scheduleText} · {group.studentsCount} students
                  </p>
                </Link>
              ))
            ) : (
              <p className="rounded-xl bg-accent/50 p-4 text-sm text-muted-foreground">
                No active groups yet.
              </p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
