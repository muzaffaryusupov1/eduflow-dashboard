import type { AuthTokens } from './auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

type LoginInput = {
  email: string;
  password: string;
};

type LoginResponse = AuthTokens;

export async function apiLogout(accessToken: string): Promise<void> {
  await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export async function apiLogin(input: LoginInput): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Unable to sign in');
  }

  return response.json();
}

export async function apiForgotPassword(email: string): Promise<void> {
  const response = await fetch(`${API_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Unable to request password reset');
  }
}

export async function apiResetPassword(token: string, newPassword: string): Promise<void> {
  const response = await fetch(`${API_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Unable to reset password');
  }
}
