import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/query/keys"
import {
  createStudent,
  fetchStudent,
  fetchStudents,
  updateStudent,
} from "./api"
import type { StudentCreateInput, StudentUpdateInput, StudentsFilters } from "./types"

export function useStudents(filters: StudentsFilters = {}) {
  return useQuery({
    queryKey: queryKeys.students.list(filters),
    queryFn: () => fetchStudents(filters),
  })
}

export function useStudent(id: string) {
  return useQuery({
    queryKey: queryKeys.students.detail(id),
    queryFn: () => fetchStudent(id),
    enabled: Boolean(id),
  })
}

export function useCreateStudent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: StudentCreateInput) => createStudent(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.students.root })
    },
  })
}

export function useUpdateStudent(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: StudentUpdateInput) => updateStudent(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.students.root })
      qc.invalidateQueries({ queryKey: queryKeys.students.detail(id) })
    },
  })
}
