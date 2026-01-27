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
import { useCreateCourse, useUpdateCourse } from "../queries"
import { courseCreateSchema, courseUpdateSchema } from "../schema"
import type { Course, CourseCreateInput } from "../types"

type Mode = "create" | "edit"

type Props = {
  mode: Mode
  course?: Course
  trigger?: React.ReactNode
  onSuccess?: () => void
}

type FormValues = z.infer<typeof courseUpdateSchema>

const schemaByMode: Record<Mode, z.ZodType<FormValues>> = {
  create: courseCreateSchema,
  edit: courseUpdateSchema,
}

export function CourseFormDialog({ mode, course, trigger, onSuccess }: Props) {
  const [open, setOpen] = useState(false)
  const createMutation = useCreateCourse()
  const updateMutation = useUpdateCourse(course?.id ?? "")

  const form = useForm<FormValues>({
    resolver: zodResolver(schemaByMode[mode]),
    defaultValues: {
      title: course?.title ?? "",
      monthlyPrice: course?.monthlyPrice ?? 0,
      status: course?.status ?? "ACTIVE",
    },
  })

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  const handleSubmit = async (values: FormValues) => {
    if (mode === "create") {
      const payload: CourseCreateInput = {
        title: values.title ?? "",
        monthlyPrice: values.monthlyPrice ?? 0,
        status: values.status ?? "ACTIVE",
      }
      await createMutation.mutateAsync(payload)
      toast.success("Course created" )
    } else if (course) {
      await updateMutation.mutateAsync(values)
      toast.error("Course updated")
    }
    setOpen(false)
    onSuccess?.()
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !isSubmitting && setOpen(val)}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="secondary" size="sm">
            {mode === "create" ? "New course" : "Edit"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create course" : "Edit course"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Course title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="monthlyPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      {...field}
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
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
                {isSubmitting ? "Saving..." : mode === "create" ? "Create" : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
