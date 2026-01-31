import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from 'sonner'
import { z } from "zod"
import { useCreateStaff, useUpdateStaff } from "../queries"
import { staffCreateSchema, staffUpdateSchema } from "../schema"
import type { CreateStaffInput, StaffUser } from "../types"

type Mode = "create" | "edit"

type Props = {
  mode: Mode
  staff?: StaffUser
  trigger?: React.ReactNode
  onSuccess?: () => void
}

type FormValues = z.infer<typeof staffUpdateSchema>

const schemaByMode: Record<Mode, z.ZodType<FormValues>> = {
  create: staffCreateSchema,
  edit: staffUpdateSchema,
}

export function StaffFormDialog({ mode, staff, trigger, onSuccess }: Props) {
  const [open, setOpen] = useState(false)
  const createMutation = useCreateStaff()
  const updateMutation = useUpdateStaff(staff?.id ?? "")

  const form = useForm<FormValues>({
    resolver: zodResolver(schemaByMode[mode]),
    defaultValues: {
      fullName: staff?.fullName ?? "",
      email: staff?.email ?? "",
      phone: staff?.phone ?? "",
      password: "",
    },
  })

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  const handleSubmit = async (values: FormValues) => {
    if (mode === "create") {
      const payload: CreateStaffInput = {
        fullName: values.fullName ?? "",
        email: values.email ?? "",
        phone: values.phone || undefined,
        password: values.password || undefined,
      }
      const result = await createMutation.mutateAsync(payload)
      if (result.temporaryPassword) {
        toast.success("Teacher created", {
          description: `Temporary password: ${result.temporaryPassword}`
        })
      } else {
        toast.success("Teacher created")
      }
    } else if (staff) {
      await updateMutation.mutateAsync({
        fullName: values.fullName,
        phone: values.phone,
        password: values.password || undefined,
      })
      toast.success("Teacher updated")
    }
    setOpen(false)
    onSuccess?.()
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !isSubmitting && setOpen(val)}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="secondary" size="sm">
            {mode === "create" ? "New teacher" : "Edit"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "New teacher" : "Edit teacher"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input placeholder="Full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} disabled={mode === "edit"} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{mode === "create" ? "Password (optional)" : "New password (optional)"}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : mode === "create" ? "Create" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
