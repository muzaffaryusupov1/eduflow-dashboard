import { httpClient } from "@/lib/http/client"
import type {
  Course,
  CourseCreateInput,
  CourseUpdateInput,
  CoursesFilters,
  CoursesListResponse,
} from "./types"

export async function fetchCourses(filters: CoursesFilters = {}) {
  const params = new URLSearchParams()
  if (filters.page) params.set("page", String(filters.page))
  if (filters.limit) params.set("limit", String(filters.limit))
  if (filters.q) params.set("search", filters.q)
  if (filters.status) params.set("status", filters.status)

  const query = params.toString()
  return httpClient<CoursesListResponse>(`/courses${query ? `?${query}` : ""}`)
}

export async function fetchCourse(id: string) {
  return httpClient<Course>(`/courses/${id}`)
}

export async function createCourse(input: CourseCreateInput) {
  return httpClient<Course>(`/courses`, {
    method: "POST",
    body: input,
  })
}

export async function updateCourse(id: string, input: CourseUpdateInput) {
  return httpClient<Course>(`/courses/${id}`, {
    method: "PATCH",
    body: input,
  })
}

export async function updateCourseStatus(id: string, status: Course["status"]) {
  return httpClient<Course>(`/courses/${id}/status`, {
    method: "PATCH",
    body: { status },
  })
}
