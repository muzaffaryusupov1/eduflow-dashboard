import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function PeoplePage() {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">People</h2>
        <p className="text-sm text-muted-foreground">
          This section will list students and staff.
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          No records yet. Add your first learner to get started.
        </p>
        <Button className="w-fit">Add student</Button>
      </CardContent>
    </Card>
  )
}
