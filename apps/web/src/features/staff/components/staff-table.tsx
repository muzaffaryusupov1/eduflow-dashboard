import { useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import { StaffUser } from "../types"
import { StaffFormDialog } from "./staff-form-dialog"
import { ResetPasswordDialog } from "./reset-password-dialog"
import { useUpdateStaffStatus } from "../queries"

type Props = {
  staff: StaffUser[]
  page: number
  pageSize: number
  total: number
  isLoading: boolean
  isError: boolean
  onPageChange: (page: number) => void
  onRefresh: () => void
}

export function StaffTable({
  staff,
  page,
  pageSize,
  total,
  isLoading,
  isError,
  onPageChange,
  onRefresh,
}: Props) {
  const updateStatus = useUpdateStaffStatus()
  const rows = useMemo(() => staff ?? [], [staff])
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const showingFrom = (page - 1) * pageSize + (rows.length ? 1 : 0)
  const showingTo = (page - 1) * pageSize + rows.length

  return (
    <Card className="p-0">
      <CardHeader className="px-4 py-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages} · {total} total
          </p>
          <Button variant="ghost" size="sm" onClick={onRefresh}>
            Refresh
          </Button>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="p-0">
        {isError ? (
          <div className="p-6 text-sm text-destructive">
            Failed to load staff list.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <>
                  {[1, 2, 3].map((row) => (
                    <TableRow key={row}>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-40" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-4 w-24 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              )}

              {!isLoading && rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                    No teachers yet.
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                rows.map((staffUser) => (
                  <TableRow key={staffUser.id}>
                    <TableCell className="font-medium">
                      {staffUser.fullName ?? "—"}
                    </TableCell>
                    <TableCell>{staffUser.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">TEACHER</Badge>
                    </TableCell>
                    <TableCell>{new Date(staffUser.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <StaffFormDialog
                        mode="edit"
                        staff={staffUser}
                        trigger={
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        }
                      />
                      <ResetPasswordDialog
                        staffId={staffUser.id}
                        trigger={
                          <Button variant="ghost" size="sm">
                            Reset
                          </Button>
                        }
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateStatus.mutate({
                            id: staffUser.id,
                            isActive: !staffUser.isActive,
                          })
                        }
                      >
                        {staffUser.isActive ? "Disable" : "Enable"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}
        <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground">
          <div>
            Showing {showingFrom}-{showingTo} of {total}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page <= 1}
            >
              Previous
            </Button>
            <span className="text-xs text-muted-foreground">
              Page {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
