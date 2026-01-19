'use client';

import {
  AuthTokens,
  AuthUser,
  decodeJwt,
  loadStoredAuth,
  saveAuth,
} from "@/lib/auth"
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
  const stored = loadStoredAuth()
  if (!stored) return { tokens: null, user: null }
  return { tokens: stored, user: decodeJwt(stored.accessToken) }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initial = getInitialAuth()
  const [tokens, setTokens] = useState<AuthTokens | null>(initial.tokens)
  const [user, setUser] = useState<AuthUser | null>(initial.user)
  const [hydrated] = useState(() => typeof window !== "undefined")

  const login = useCallback((newTokens: AuthTokens) => {
    setTokens(newTokens)
    setUser(decodeJwt(newTokens.accessToken))
    saveAuth(newTokens)
  }, [])

  const logout = useCallback(() => {
    setTokens(null)
    setUser(null)
    saveAuth(null)
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
