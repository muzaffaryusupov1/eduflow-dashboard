import { useMemo, useState } from "react"
import {
  KeyRound,
  MoreHorizontal,
  Pencil,
  UserCheck,
  UserX,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  isLoading: boolean
  isError: boolean
  emptyMessage?: string
}

export function StaffTable({ staff, isLoading, isError, emptyMessage }: Props) {
  const updateStatus = useUpdateStaffStatus()
  const rows = useMemo(() => staff ?? [], [staff])

  const [editStaff, setEditStaff] = useState<StaffUser | null>(null)
  const [resetStaff, setResetStaff] = useState<StaffUser | null>(null)

  if (isError) {
    return (
      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-sm text-destructive">
        Failed to load staff list.
      </div>
    )
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border bg-card">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow className="hover:bg-muted/40">
            <TableHead className="h-11 px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Name</TableHead>
            <TableHead className="h-11 px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</TableHead>
            <TableHead className="h-11 px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Role</TableHead>
            <TableHead className="h-11 px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</TableHead>
            <TableHead className="h-11 px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Created</TableHead>
            <TableHead className="h-11 px-4 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading &&
            [1, 2, 3].map((row) => (
              <TableRow key={row}>
                <TableCell className="px-4 py-3"><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell className="px-4 py-3"><Skeleton className="h-4 w-40" /></TableCell>
                <TableCell className="px-4 py-3"><Skeleton className="h-5 w-16" /></TableCell>
                <TableCell className="px-4 py-3"><Skeleton className="h-5 w-16" /></TableCell>
                <TableCell className="px-4 py-3"><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell className="px-4 py-3 text-right">
                  <Skeleton className="h-7 w-7 ml-auto rounded-md" />
                </TableCell>
              </TableRow>
            ))}

          {!isLoading && rows.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="py-12 text-center text-sm text-muted-foreground"
              >
                {emptyMessage ?? "No teachers yet."}
              </TableCell>
            </TableRow>
          )}

          {!isLoading &&
            rows.map((staffUser) => (
              <TableRow key={staffUser.id}>
                <TableCell className="px-4 py-3 font-medium">
                  {staffUser.fullName ?? "—"}
                </TableCell>
                <TableCell className="px-4 py-3 text-muted-foreground">{staffUser.email}</TableCell>
                <TableCell className="px-4 py-3">
                  <Badge variant="secondary">TEACHER</Badge>
                </TableCell>
                <TableCell className="px-4 py-3">
                  {staffUser.isActive ? (
                    <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      Disabled
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="px-4 py-3 text-muted-foreground">
                  {new Date(staffUser.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="px-4 py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm" aria-label="Open actions">
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem
                        onSelect={(e) => {
                          e.preventDefault()
                          setEditStaff(staffUser)
                        }}
                      >
                        <Pencil />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={(e) => {
                          e.preventDefault()
                          setResetStaff(staffUser)
                        }}
                      >
                        <KeyRound />
                        Reset password
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant={staffUser.isActive ? "destructive" : "default"}
                        onSelect={() =>
                          updateStatus.mutate({
                            id: staffUser.id,
                            isActive: !staffUser.isActive,
                          })
                        }
                      >
                        {staffUser.isActive ? <UserX /> : <UserCheck />}
                        {staffUser.isActive ? "Disable" : "Enable"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      </div>

      {editStaff && (
        <StaffFormDialog
          mode="edit"
          staff={editStaff}
          open={true}
          onOpenChange={(next) => {
            if (!next) setEditStaff(null)
          }}
        />
      )}
      {resetStaff && (
        <ResetPasswordDialog
          staffId={resetStaff.id}
          open={true}
          onOpenChange={(next) => {
            if (!next) setResetStaff(null)
          }}
        />
      )}
    </>
  )
}
