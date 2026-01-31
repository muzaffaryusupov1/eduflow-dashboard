import { z } from "zod"

const groupBaseSchema = z.object({
  title: z.string().optional(),
  courseId: z.string().min(1, "Course is required"),
  teacherId: z.string().min(1, "Teacher is required"),
  scheduleText: z.string().min(3, "Schedule is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  status: z.enum(["ACTIVE", "PAUSED", "FINISHED"]).optional(),
})

export const groupCreateSchema = groupBaseSchema.refine(
  (data) => {
    if (!data.endDate || !data.startDate) return true
    return new Date(data.endDate) >= new Date(data.startDate)
  },
  { message: "End date must be after start date", path: ["endDate"] }
)

export const groupUpdateSchema = groupBaseSchema.partial().refine(
  (data) => {
    if (!data.endDate || !data.startDate) return true
    return new Date(data.endDate) >= new Date(data.startDate)
  },
  { message: "End date must be after start date", path: ["endDate"] }
)

export const groupsFilterSchema = z.object({
  page: z.number().int().min(1).optional(),
  pageSize: z.number().int().min(1).max(100).optional(),
  q: z.string().optional(),
  courseId: z.string().optional(),
  teacherId: z.string().optional(),
  status: z.enum(["ACTIVE", "PAUSED", "FINISHED"]).optional(),
})
