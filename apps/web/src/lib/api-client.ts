const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

type FetchOptions = RequestInit & {
  authToken?: string
}

export async function apiFetch<T>(path: string, options: FetchOptions = {}) {
  const { authToken, headers, ...rest } = options
  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...(headers ?? {}),
    },
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || "Request failed")
  }

  return response.json() as Promise<T>
}
