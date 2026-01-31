import { httpClient } from "@/lib/http/client"
import type {
  Group,
  GroupCreateInput,
  GroupUpdateInput,
  GroupsFilters,
  GroupsListResponse,
} from "./types"

export async function fetchGroups(filters: GroupsFilters = {}) {
  const params = new URLSearchParams()
  if (filters.page) params.set("page", String(filters.page))
  if (filters.pageSize) params.set("pageSize", String(filters.pageSize))
  if (filters.q) params.set("query", filters.q)
  if (filters.courseId) params.set("courseId", filters.courseId)
  if (filters.teacherId) params.set("teacherId", filters.teacherId)
  if (filters.status) params.set("status", filters.status)

  const query = params.toString()
  return httpClient<GroupsListResponse>(`/groups${query ? `?${query}` : ""}`)
}

export async function fetchGroup(id: string) {
  return httpClient<Group>(`/groups/${id}`)
}

export async function createGroup(input: GroupCreateInput) {
  return httpClient<Group>(`/groups`, {
    method: "POST",
    body: input,
  })
}

export async function updateGroup(id: string, input: GroupUpdateInput) {
  return httpClient<Group>(`/groups/${id}`, {
    method: "PATCH",
    body: input,
  })
}

export async function updateGroupStatus(id: string, status: Group["status"]) {
  return httpClient<Group>(`/groups/${id}/status`, {
    method: "PATCH",
    body: { status },
  })
}
