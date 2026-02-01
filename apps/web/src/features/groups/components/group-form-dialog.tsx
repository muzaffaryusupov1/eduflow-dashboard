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
import { useCourses } from "@/features/courses/queries"
import { useTeachersOptions } from "@/features/staff/queries"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from 'sonner'
import { z } from "zod"
import { useCreateGroup, useUpdateGroup } from "../queries"
import { groupCreateSchema, groupUpdateSchema } from "../schema"
import type { Group, GroupCreateInput } from "../types"

type Mode = "create" | "edit"

type Props = {
  mode: Mode
  group?: Group
  trigger?: React.ReactNode
  onSuccess?: () => void
}

type FormValues = z.infer<typeof groupUpdateSchema>

const schemaByMode: Record<Mode, z.ZodType<FormValues>> = {
  create: groupCreateSchema,
  edit: groupUpdateSchema,
}

export function GroupFormDialog({ mode, group, trigger, onSuccess }: Props) {
  const [open, setOpen] = useState(false)
  const createMutation = useCreateGroup()
  const updateMutation = useUpdateGroup(group?.id ?? "")
  const coursesQuery = useCourses({ page: 1, limit: 100 })
  const teachers = useTeachersOptions()

  const form = useForm<FormValues>({
    resolver: zodResolver(schemaByMode[mode] as any),
    defaultValues: {
      title: group?.title ?? "",
      courseId: group?.courseId ?? "",
      teacherId: group?.teacherId ?? "",
      scheduleText: group?.scheduleText ?? "",
      startDate: group?.startDate ? group.startDate.slice(0, 10) : "",
      endDate: group?.endDate ? group.endDate.slice(0, 10) : "",
      status: group?.status ?? "ACTIVE",
    },
  })

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  const handleSubmit = async (values: FormValues) => {
    if (mode === "create") {
      const payload: GroupCreateInput = {
        title: values.title || undefined,
        courseId: values.courseId ?? "",
        teacherId: values.teacherId ?? "",
        scheduleText: values.scheduleText ?? "",
        startDate: values.startDate ?? "",
        endDate: values.endDate || undefined,
        status: values.status ?? "ACTIVE",
      }
      await createMutation.mutateAsync(payload)
      toast.success("Group created")
    } else if (group) {
      await updateMutation.mutateAsync({
        title: values.title,
        courseId: values.courseId,
        teacherId: values.teacherId,
        scheduleText: values.scheduleText,
        startDate: values.startDate,
        endDate: values.endDate || undefined,
        status: values.status,
      })
      toast.success("Group updated")
    }
    setOpen(false)
    onSuccess?.()
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !isSubmitting && setOpen(val)}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="secondary" size="sm">
            {mode === "create" ? "New group" : "Edit"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create group" : "Edit group"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Group title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="courseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        {...field}
                      >
                        <option value="">Select course</option>
                        {coursesQuery.data?.data.map((course) => (
                          <option key={course.id} value={course.id}>
                            {course.title}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="teacherId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teacher</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        {...field}
                      >
                        <option value="">Select teacher</option>
                        {teachers.options.map((teacher) => (
                          <option key={teacher.value} value={teacher.value}>
                            {teacher.label}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="scheduleText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Schedule</FormLabel>
                  <FormControl>
                    <Input placeholder="Mon/Wed/Fri 19:00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End date (optional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                      <option value="PAUSED">Paused</option>
                      <option value="FINISHED">Finished</option>
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
                {isSubmitting ? "Saving..." : mode === "create" ? "Create" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
