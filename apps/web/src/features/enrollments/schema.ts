import { z } from "zod"

export const enrollmentCreateSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  startDate: z.string().min(1, "Start date is required"),
})

export const enrollmentUpdateSchema = z.object({
  status: z.enum(["ACTIVE", "LEFT", "FINISHED"]).optional(),
  endDate: z.string().optional(),
})
