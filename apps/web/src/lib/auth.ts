import type { Role } from './roles'

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthUser = {
  email: string;
  role: Role;
};

const STORAGE_KEY = 'eduflow.auth';

export function decodeJwt(token: string): AuthUser {
  try {
    const payload = token.split('.')[1];
    let normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    while (normalized.length % 4 !== 0) {
      normalized += '=';
    }
    const decoded = JSON.parse(atob(normalized));

    return {
      email: decoded.email ?? 'user@eduflow.dev',
      role: decoded.role ?? 'TEACHER'
    } as AuthUser;
  } catch {
    return { email: 'user@eduflow.dev', role: 'TEACHER' };
  }
}

export function saveAuth(tokens: AuthTokens | null) {
  if (typeof window === 'undefined') {
    return;
  }

  if (!tokens) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
}

export function loadStoredAuth(): AuthTokens | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthTokens;
  } catch {
    return null;
  }
}
