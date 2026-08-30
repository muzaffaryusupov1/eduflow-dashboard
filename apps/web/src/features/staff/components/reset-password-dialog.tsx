import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useResetStaffPassword } from "../queries"

type Props = {
  staffId: string
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ResetPasswordDialog({
  staffId,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: Props) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const setOpen = (next: boolean) => {
    if (isControlled) controlledOnOpenChange?.(next)
    else setInternalOpen(next)
  }
  const resetMutation = useResetStaffPassword()

  const handleReset = async () => {
    await resetMutation.mutateAsync(staffId)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !resetMutation.isPending && setOpen(val)}>
      {trigger !== undefined ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : isControlled ? null : (
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm">
            Reset password
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reset password</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          This will generate a temporary password for the teacher.
        </p>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={resetMutation.isPending}>
            Cancel
          </Button>
          <Button onClick={handleReset} disabled={resetMutation.isPending}>
            {resetMutation.isPending ? "Resetting..." : "Confirm reset"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
