'use client';

import {
  AuthTokens,
  AuthUser,
  decodeJwt,
} from "@/lib/auth"
import { apiLogout } from "@/lib/api-client"
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  migrateLegacyAuthObject,
  setTokens as persistTokens,
} from "@/lib/auth/token-storage"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

type AuthContextValue = {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  hydrated: boolean;
  login: (tokens: AuthTokens) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initial = getInitialAuth()
  const [tokens, setTokens] = useState<AuthTokens | null>(initial.tokens)
  const [user, setUser] = useState<AuthUser | null>(initial.user)
  /**
   * STRICT RULE:
   * Deleting the following useEffect is STRICTLY FORBIDDEN.
   * Reason: In Next.js, there may be differences between Client/Server rendering.
   * The hydrated flag lets us know when real client-side rendering has started, preventing hydration errors.
   * Example: During SSR, "localStorage" or "window" do not exist, but they do on the client.
   * This pattern protects from Next.js hydration errors and prevents the UI from rendering in an incorrect state.
   * During any refactor or change - NEVER REMOVE the following useEffect!
   */
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true)
  }, [])

  const login = useCallback((newTokens: AuthTokens) => {
    setTokens(newTokens)
    setUser(decodeJwt(newTokens.accessToken))
    persistTokens(newTokens)
  }, [])

  const logout = useCallback(() => {
    const token = getAccessToken()
    if (token) {
      apiLogout(token).catch(() => {})
    }
    setTokens(null)
    setUser(null)
    clearTokens()
  }, [])

  const value = useMemo(
    () => ({
      user,
      tokens,
      hydrated,
      login,
      logout,
      isAuthenticated: Boolean(tokens),
    }),
    [hydrated, login, logout, tokens, user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }

  return context
}

function getInitialAuth(): { tokens: AuthTokens | null; user: AuthUser | null } {
  if (typeof window === "undefined") return { tokens: null, user: null }
  migrateLegacyAuthObject()
  const accessToken = getAccessToken()
  const refreshToken = getRefreshToken()
  if (!accessToken || !refreshToken) return { tokens: null, user: null }
  return {
    tokens: { accessToken, refreshToken },
    user: decodeJwt(accessToken),
  }
}
