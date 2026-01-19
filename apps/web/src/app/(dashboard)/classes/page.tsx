import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ClassesPage() {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Classes</h2>
        <p className="text-sm text-muted-foreground">
          Plan schedules and assign teachers here.
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          Create your first class to start scheduling sessions.
        </p>
        <Button className="w-fit" variant="secondary">
          Create class
        </Button>
      </CardContent>
    </Card>
  )
}
