import { env } from "@/lib/config/env"
import { ApiError } from "./types"
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "@/lib/auth/token-storage"

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE"

type RequestOptions = {
  method?: HttpMethod
  headers?: Record<string, string>
  body?: unknown
  cache?: RequestCache
  _retry?: boolean
}

export async function httpClient<T>(
  path: string,
  { method = "GET", headers, body, cache, _retry }: RequestOptions = {}
): Promise<T> {
  const accessToken = getAccessToken()
  const response = await fetch(`${env.apiUrl}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(headers ?? {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache,
  })

  const contentType = response.headers.get("content-type")
  const isJson = contentType?.includes("application/json")
  const parsed = isJson ? await response.json().catch(() => null) : await response.text()

  if (!response.ok) {
    if ((response.status === 401 || response.status === 403) && !_retry) {
      const refreshToken = getRefreshToken()
      if (refreshToken) {
        try {
          const refreshResponse = await fetch(`${env.apiUrl}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          })
          if (refreshResponse.ok) {
            const refreshed = (await refreshResponse.json()) as {
              accessToken: string
              refreshToken: string
            }
            setTokens(refreshed)
            return httpClient<T>(path, { method, headers, body, cache, _retry: true })
          }
        } catch {
          // fall through to logout
        }
      }
      clearTokens()
      if (typeof window !== "undefined") {
        window.location.replace("/login")
      }
    }
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
