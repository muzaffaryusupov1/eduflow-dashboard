import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/query/keys"
import {
  createCourse,
  fetchCourse,
  fetchCourses,
  updateCourse,
  updateCourseStatus,
} from "./api"
import type { CourseUpdateInput, CourseCreateInput, CoursesFilters } from "./types"

export function useCourses(filters: CoursesFilters = {}) {
  return useQuery({
    queryKey: queryKeys.courses.list(filters),
    queryFn: () => fetchCourses(filters),
  })
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: queryKeys.courses.detail(id),
    queryFn: () => fetchCourse(id),
    enabled: Boolean(id),
  })
}

export function useCreateCourse() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CourseCreateInput) => createCourse(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.courses.root })
    },
  })
}

export function useUpdateCourse(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CourseUpdateInput) => updateCourse(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.courses.root })
      qc.invalidateQueries({ queryKey: queryKeys.courses.detail(id) })
    },
  })
}

export function useUpdateCourseStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "ACTIVE" | "INACTIVE" }) =>
      updateCourseStatus(id, status),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: queryKeys.courses.root })
      qc.invalidateQueries({ queryKey: queryKeys.courses.detail(variables.id) })
    },
  })
}
