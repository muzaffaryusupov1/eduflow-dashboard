import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/query/keys"
import {
  createEnrollment,
  fetchGroupEnrollments,
  fetchStudentEnrollments,
  updateEnrollment,
} from "./api"
import type { CreateEnrollmentInput, UpdateEnrollmentInput } from "./types"

export function useGroupEnrollments(groupId: string, params: { status?: string; page?: number; pageSize?: number } = {}) {
  return useQuery({
    queryKey: queryKeys.enrollments.group(groupId, params),
    queryFn: () => fetchGroupEnrollments(groupId, params),
    enabled: Boolean(groupId),
  })
}

export function useCreateEnrollment(groupId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateEnrollmentInput) => createEnrollment(groupId, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.enrollments.group(groupId) })
      qc.invalidateQueries({ queryKey: queryKeys.enrollments.root })
    },
  })
}

export function useUpdateEnrollment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateEnrollmentInput }) =>
      updateEnrollment(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.enrollments.root })
    },
  })
}

export function useStudentEnrollments(studentId: string) {
  return useQuery({
    queryKey: queryKeys.enrollments.student(studentId),
    queryFn: () => fetchStudentEnrollments(studentId),
    enabled: Boolean(studentId),
  })
}
