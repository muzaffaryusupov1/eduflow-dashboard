"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useCreateStudent, useUpdateStudent } from "../queries"
import { studentCreateSchema, studentUpdateSchema } from "../schema"
import type { Student, StudentCreateInput } from "../types"

type Mode = "create" | "edit"

type Props = {
  mode: Mode
  student?: Student
  trigger?: React.ReactNode
  onSuccess?: () => void
}

type StudentFormValues = z.infer<typeof studentUpdateSchema>

const createSchema = studentCreateSchema.extend({ isActive: z.boolean().optional() })
const schemaByMode: Record<Mode, z.ZodType<StudentFormValues>> = {
  create: createSchema,
  edit: studentUpdateSchema,
}

export function StudentFormDialog({ mode, student, trigger, onSuccess }: Props) {
  const [open, setOpen] = useState(false)
  const createMutation = useCreateStudent()
  const updateMutation = useUpdateStudent(student?.id ?? "")

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(schemaByMode[mode]),
    defaultValues: {
      firstName: student?.firstName ?? "",
      lastName: student?.lastName ?? "",
      email: student?.email ?? "",
      phone: student?.phone ?? "",
      isActive: student?.isActive ?? true,
    },
  })

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  const onSubmit = async (values: StudentFormValues) => {
    if (mode === "create") {
      const payload: StudentCreateInput = {
        firstName: values.firstName as string,
        lastName: values.lastName as string,
        email: values.email as string,
        phone: values.phone,
      }
      await createMutation.mutateAsync(payload)
    } else if (student) {
      await updateMutation.mutateAsync(values)
    }
    setOpen(false)
    onSuccess?.()
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !isSubmitting && setOpen(val)}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="secondary" size="sm">
            {mode === "create" ? "Add student" : "Edit"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Add student" : "Edit student"}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new learner to your center."
              : "Update student details."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Input type="email" {...field} />
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
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {mode === "edit" && (
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <select
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={field.value ? "active" : "inactive"}
                        onChange={(e) => field.onChange(e.target.value === "active")}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !form.formState.isValid}>
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
