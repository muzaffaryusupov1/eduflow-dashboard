'use client';

import {
  AuthTokens,
  AuthUser,
  decodeJwt,
} from "@/lib/auth"
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initial = getInitialAuth()
  const [tokens, setTokens] = useState<AuthTokens | null>(initial.tokens)
  const [user, setUser] = useState<AuthUser | null>(initial.user)
  const [hydrated] = useState(() => typeof window !== "undefined")

  const login = useCallback((newTokens: AuthTokens) => {
    setTokens(newTokens)
    setUser(decodeJwt(newTokens.accessToken))
    persistTokens(newTokens)
  }, [])

  const logout = useCallback(() => {
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
