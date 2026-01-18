import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Here is a quick look at your center today.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: 'Active students', value: '248', trend: '+6%' },
          { label: 'Classes today', value: '12', trend: 'On track' },
          { label: 'Monthly revenue', value: '$18.4k', trend: '+3.2%' }
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="pt-5">
              <p className="text-sm text-muted-foreground">
                {item.label}
              </p>
              <div className="mt-4 flex items-end justify-between">
                <p className="text-3xl font-semibold text-foreground">
                  {item.value}
                </p>
                <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                  {item.trend}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader className="border-b border-border pb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Recent payments
            </h2>
            <p className="text-sm text-muted-foreground">
              Latest transactions from families.
            </p>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="divide-y divide-border">
              {[
                { name: 'Aisha Karimova', amount: '$220', status: 'Paid' },
                { name: 'Jasur Ubaydullayev', amount: '$180', status: 'Pending' },
                { name: 'Madina Akmal', amount: '$260', status: 'Paid' }
              ].map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between px-5 py-4"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.status}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    {item.amount}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-border pb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Today classes
            </h2>
            <p className="text-sm text-muted-foreground">
              Sessions happening in the next hours.
            </p>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {[
              { title: 'Math Fundamentals', time: '09:00 · Room 3' },
              { title: 'IELTS Speaking', time: '11:30 · Room 1' },
              { title: 'Robotics Lab', time: '14:00 · Lab A' }
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl bg-muted p-3"
              >
                <p className="text-sm font-medium text-foreground">
                  {item.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.time}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
