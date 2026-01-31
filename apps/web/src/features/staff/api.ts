import { httpClient } from "@/lib/http/client"
import type {
  CreateStaffInput,
  StaffFilters,
  StaffListResponse,
  StaffUser,
  UpdateStaffInput,
} from "./types"

export async function fetchStaff(filters: StaffFilters = {}) {
  const params = new URLSearchParams()
  if (filters.page) params.set("page", String(filters.page))
  if (filters.pageSize) params.set("pageSize", String(filters.pageSize))
  if (filters.q) params.set("query", filters.q)

  const query = params.toString()
  return httpClient<StaffListResponse>(`/staff${query ? `?${query}` : ""}`)
}

export async function fetchStaffDetail(id: string) {
  return httpClient<StaffUser>(`/staff/${id}`)
}

export async function createStaff(input: CreateStaffInput) {
  return httpClient<{ user: StaffUser; temporaryPassword?: string }>(`/staff`, {
    method: "POST",
    body: input,
  })
}

export async function updateStaff(id: string, input: UpdateStaffInput) {
  return httpClient<StaffUser>(`/staff/${id}`, {
    method: "PATCH",
    body: input,
  })
}

export async function updateStaffStatus(id: string, isActive: boolean) {
  return httpClient<StaffUser>(`/staff/${id}/status`, {
    method: "PATCH",
    body: { isActive },
  })
}

export async function resetStaffPassword(id: string) {
  return httpClient<{ id: string; temporaryPassword: string }>(`/staff/${id}/reset-password`, {
    method: "POST",
  })
}
