import { httpClient } from "@/lib/http/client"
import type {
  Student,
  StudentCreateInput,
  StudentUpdateInput,
  StudentsFilters,
  StudentsListResponse,
} from "./types"

export async function fetchStudents(filters: StudentsFilters = {}) {
  const params = new URLSearchParams()
  if (filters.page) params.set("page", String(filters.page))
  if (filters.limit) params.set("limit", String(filters.limit))
  if (filters.q) params.set("search", filters.q)
  if (filters.status) params.set("status", filters.status)

  const query = params.toString()
  return httpClient<StudentsListResponse>(`/students${query ? `?${query}` : ""}`)
}

export async function fetchStudent(id: string) {
  return httpClient<Student>(`/students/${id}`)
}

export async function createStudent(input: StudentCreateInput) {
  return httpClient<Student>(`/students`, {
    method: "POST",
    body: input,
  })
}

export async function updateStudent(id: string, input: StudentUpdateInput) {
  return httpClient<Student>(`/students/${id}`, {
    method: "PATCH",
    body: input,
  })
}
