import { env } from "@/lib/config/env"
import { ApiError } from "./types"

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE"

type RequestOptions = {
  method?: HttpMethod
  headers?: Record<string, string>
  body?: unknown
  authToken?: string
  cache?: RequestCache
}

export async function httpClient<T>(
  path: string,
  { method = "GET", headers, body, authToken, cache }: RequestOptions = {}
): Promise<T> {
  const response = await fetch(`${env.apiUrl}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...(headers ?? {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache,
  })

  const contentType = response.headers.get("content-type")
  const isJson = contentType?.includes("application/json")
  const parsed = isJson ? await response.json().catch(() => null) : await response.text()

  if (!response.ok) {
    throw new ApiError({
      status: response.status,
      message:
        (isJson && parsed && typeof parsed === "object" && "message" in parsed
          ? String((parsed as { message?: string }).message)
          : undefined) || response.statusText || "Request failed",
      body: parsed,
    })
  }

  return parsed as T
}
