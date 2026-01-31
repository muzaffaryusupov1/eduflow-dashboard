import { z } from "zod"

export const courseBaseSchema = z.object({
  title: z.string().min(2, "Title is required"),
  monthlyPrice: z
    .number({ invalid_type_error: "Price must be a number" })
    .min(0, "Price cannot be negative"),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
})

export const courseCreateSchema = courseBaseSchema
export const courseUpdateSchema = courseBaseSchema.partial().extend({
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
})

export const coursesFilterSchema = z.object({
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  q: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
})
