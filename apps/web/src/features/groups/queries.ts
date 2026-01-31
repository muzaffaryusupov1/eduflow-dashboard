import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/query/keys"
import {
  createGroup,
  fetchGroup,
  fetchGroups,
  updateGroup,
  updateGroupStatus,
} from "./api"
import type { GroupCreateInput, GroupUpdateInput, GroupsFilters } from "./types"

export function useGroups(filters: GroupsFilters = {}) {
  return useQuery({
    queryKey: queryKeys.groups.list(filters),
    queryFn: () => fetchGroups(filters),
  })
}

export function useGroup(id: string) {
  return useQuery({
    queryKey: queryKeys.groups.detail(id),
    queryFn: () => fetchGroup(id),
    enabled: Boolean(id),
  })
}

export function useCreateGroup() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: GroupCreateInput) => createGroup(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.groups.root })
    },
  })
}

export function useUpdateGroup(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: GroupUpdateInput) => updateGroup(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.groups.root })
      qc.invalidateQueries({ queryKey: queryKeys.groups.detail(id) })
    },
  })
}

export function useUpdateGroupStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "ACTIVE" | "PAUSED" | "FINISHED" }) =>
      updateGroupStatus(id, status),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: queryKeys.groups.root })
      qc.invalidateQueries({ queryKey: queryKeys.groups.detail(variables.id) })
    },
  })
}
