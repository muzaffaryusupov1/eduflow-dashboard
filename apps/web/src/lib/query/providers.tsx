"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import { createQueryClient } from "./query-client"

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => createQueryClient())
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
