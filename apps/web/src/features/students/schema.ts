import { z } from "zod"

export const studentCreateSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
})

export const studentUpdateSchema = studentCreateSchema.partial().extend({
  isActive: z.boolean().optional(),
})

export const studentsFilterSchema = z.object({
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  q: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
})
