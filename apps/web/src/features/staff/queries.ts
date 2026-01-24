import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/query/keys"
import {
  createStaff,
  fetchStaff,
  fetchStaffDetail,
  resetStaffPassword,
  updateStaff,
  updateStaffStatus,
} from "./api"
import type { CreateStaffInput, StaffFilters, UpdateStaffInput } from "./types"

export function useStaffList(filters: StaffFilters = {}) {
  return useQuery({
    queryKey: queryKeys.staff.list(filters),
    queryFn: () => fetchStaff(filters),
  })
}

export function useStaffDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.staff.detail(id),
    queryFn: () => fetchStaffDetail(id),
    enabled: Boolean(id),
  })
}

export function useCreateStaff() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateStaffInput) => createStaff(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.staff.root })
    },
  })
}

export function useUpdateStaff(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdateStaffInput) => updateStaff(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.staff.root })
      qc.invalidateQueries({ queryKey: queryKeys.staff.detail(id) })
    },
  })
}

export function useUpdateStaffStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      updateStaffStatus(id, isActive),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: queryKeys.staff.root })
      qc.invalidateQueries({ queryKey: queryKeys.staff.detail(variables.id) })
    },
  })
}

export function useResetStaffPassword() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => resetStaffPassword(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.staff.root })
    },
  })
}

export function useTeachersOptions() {
  const { data, isLoading } = useStaffList({ page: 1, pageSize: 200 })
  return {
    isLoading,
    options:
      data?.data.map((teacher) => ({
        value: teacher.id,
        label: teacher.fullName ?? teacher.email,
      })) ?? [],
  }
}
