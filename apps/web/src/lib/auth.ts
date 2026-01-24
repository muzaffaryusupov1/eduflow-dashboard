import type { Role } from './roles'

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthUser = {
  email: string;
  role: Role;
};

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
