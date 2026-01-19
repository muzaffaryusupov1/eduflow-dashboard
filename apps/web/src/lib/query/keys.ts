export const queryKeys = {
  students: {
    root: ["students"] as const,
    list: (filters?: Record<string, unknown>) =>
      ["students", "list", filters ?? {}] as const,
    detail: (id: string) => ["students", "detail", id] as const,
  },
}
