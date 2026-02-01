import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Enrollment } from "../types"
import { useUpdateEnrollment } from "../queries"

type Props = {
  items: Enrollment[]
  isLoading: boolean
  isError: boolean
}

export function GroupEnrollmentsTable({ items, isLoading, isError }: Props) {
  const updateEnrollment = useUpdateEnrollment()

  return (
    <Card className="p-0">
      <CardHeader className="px-4 py-3">
        <div className="text-sm text-muted-foreground">Group students</div>
      </CardHeader>
      <Separator />
      <CardContent className="p-0">
        {isError ? (
          <div className="p-6 text-sm text-destructive">Failed to load enrollments.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Start date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <>
                  {[1, 2, 3].map((row) => (
                    <TableRow key={row}>
                      <TableCell>
                        <Skeleton className="h-4 w-40" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-4 w-24 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              )}
              {!isLoading && items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                    No students enrolled.
                  </TableCell>
                </TableRow>
              )}
              {!isLoading &&
                items.map((enrollment) => (
                  <TableRow key={enrollment.id}>
                    <TableCell className="font-medium">
                      {enrollment.student?.firstName} {enrollment.student?.lastName}
                    </TableCell>
                    <TableCell>{enrollment.student?.phone ?? "—"}</TableCell>
                    <TableCell>{new Date(enrollment.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{enrollment.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateEnrollment.mutate({ id: enrollment.id, input: { status: "LEFT" } })
                        }
                      >
                        Mark left
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateEnrollment.mutate({ id: enrollment.id, input: { status: "FINISHED" } })
                        }
                      >
                        Finish
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
