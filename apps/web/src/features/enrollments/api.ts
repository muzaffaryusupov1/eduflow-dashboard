import { httpClient } from "@/lib/http/client"
import type {
  CreateEnrollmentInput,
  Enrollment,
  GroupEnrollmentsResponse,
  UpdateEnrollmentInput,
} from "./types"

export async function fetchGroupEnrollments(groupId: string, params: { status?: string; page?: number; pageSize?: number } = {}) {
  const search = new URLSearchParams()
  if (params.status) search.set("status", params.status)
  if (params.page) search.set("page", String(params.page))
  if (params.pageSize) search.set("pageSize", String(params.pageSize))

  const query = search.toString()
  return httpClient<GroupEnrollmentsResponse>(
    `/groups/${groupId}/enrollments${query ? `?${query}` : ""}`
  )
}

export async function createEnrollment(groupId: string, input: CreateEnrollmentInput) {
  return httpClient<Enrollment>(`/groups/${groupId}/enrollments`, {
    method: "POST",
    body: input,
  })
}

export async function updateEnrollment(id: string, input: UpdateEnrollmentInput) {
  return httpClient<Enrollment>(`/enrollments/${id}`, {
    method: "PATCH",
    body: input,
  })
}

export async function fetchStudentEnrollments(studentId: string) {
  return httpClient<Enrollment[]>(`/students/${studentId}/enrollments`)
}
