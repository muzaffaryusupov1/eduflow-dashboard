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
import { fetchStudents } from "@/features/students/api"
import type { Student } from "@/features/students/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from 'sonner'
import { z } from "zod"
import { useCreateEnrollment } from "../queries"
import { enrollmentCreateSchema } from "../schema"

type Props = {
  groupId: string
  trigger?: React.ReactNode
  onSuccess?: () => void
}

type FormValues = z.infer<typeof enrollmentCreateSchema>

export function AddStudentToGroupDialog({ groupId, trigger, onSuccess }: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Student[]>([])
  const createMutation = useCreateEnrollment(groupId)

  const form = useForm<FormValues>({
    resolver: zodResolver(enrollmentCreateSchema),
    defaultValues: {
      studentId: "",
      startDate: new Date().toISOString().slice(0, 10),
    },
  })

  useEffect(() => {
    const t = setTimeout(async () => {
      if (!query.trim()) {
        setResults([])
        return
      }
      try {
        const data = await fetchStudents({ page: 1, limit: 10, q: query })
        setResults(data.data)
      } catch {
        setResults([])
      }
    }, 300)
    return () => clearTimeout(t)
  }, [query])

  const handleSubmit = async (values: FormValues) => {
    await createMutation.mutateAsync(values)
    toast.success("Student enrolled")
    setOpen(false)
    onSuccess?.()
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !createMutation.isPending && setOpen(val)}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="secondary" size="sm">
            Add student
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add student</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input
                        placeholder="Search student by name/email"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                      />
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      >
                        <option value="">Select student</option>
                        {results.map((student) => (
                          <option key={student.id} value={student.id}>
                            {student.firstName} {student.lastName} • {student.email}
                          </option>
                        ))}
                      </select>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={createMutation.isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Saving..." : "Add"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
