import type { AuthTokens } from "@/lib/auth"

const ACCESS_KEY = "accessToken"
const REFRESH_KEY = "refreshToken"
const LEGACY_KEY = "eduflow.auth"

export function getAccessToken() {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(ACCESS_KEY)
}

export function getRefreshToken() {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(REFRESH_KEY)
}

export function setTokens(tokens: AuthTokens) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(ACCESS_KEY, tokens.accessToken)
  window.localStorage.setItem(REFRESH_KEY, tokens.refreshToken)
}

export function clearTokens() {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(ACCESS_KEY)
  window.localStorage.removeItem(REFRESH_KEY)
}

export function migrateLegacyAuthObject() {
  if (typeof window === "undefined") return
  const legacy = window.localStorage.getItem(LEGACY_KEY)
  if (!legacy) return

  try {
    const parsed = JSON.parse(legacy) as AuthTokens
    if (parsed?.accessToken && parsed?.refreshToken) {
      setTokens(parsed)
    }
  } catch {
    // ignore invalid legacy payload
  } finally {
    window.localStorage.removeItem(LEGACY_KEY)
  }
}
