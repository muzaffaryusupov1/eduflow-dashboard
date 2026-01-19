import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const kpis = [
  { label: "Students", value: "248" },
  { label: "Classes", value: "12" },
  { label: "Revenue", value: "$18.4k" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">
          Welcome back
        </h2>
        <p className="text-sm text-muted-foreground">
          Track your center activity at a glance.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardHeader className="pb-2">
              <p className="text-sm text-muted-foreground">{kpi.label}</p>
            </CardHeader>
            <CardContent className="flex items-end justify-between">
              <p className="text-3xl font-semibold">{kpi.value}</p>
              <Skeleton className="h-4 w-12" />
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Recent payments</h3>
            <p className="text-sm text-muted-foreground">
              Placeholder transactions from families.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((row) => (
              <div
                key={row}
                className="flex items-center justify-between rounded-lg border border-border p-3"
              >
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Today classes</h3>
            <p className="text-sm text-muted-foreground">
              Upcoming sessions and rooms.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((row) => (
              <div
                key={row}
                className="rounded-lg border border-border p-3"
              >
                <Skeleton className="h-4 w-36" />
                <Skeleton className="mt-2 h-3 w-24" />
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
