import type { AuthTokens } from './auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

type LoginInput = {
  email: string;
  password: string;
};

type LoginResponse = AuthTokens;

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
