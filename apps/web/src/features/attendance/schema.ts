import { z } from "zod"

export const attendanceRecordSchema = z.object({
  studentId: z.string().min(1),
  status: z.enum(["PRESENT", "ABSENT", "LATE"]),
  note: z.string().optional(),
})

export const attendanceSessionSchema = z.object({
  groupId: z.string().min(1),
  date: z.string().min(1),
  records: z.array(attendanceRecordSchema),
})
