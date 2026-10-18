const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/+$/, '')

export async function apiRequest(endpoint, { body, headers, ...options } = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    credentials: 'include',                       // envía y guarda las cookies de sesión
    ...options,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(typeof data?.detail === 'string' ? data.detail : `Error ${response.status}`)
  }
  return data
}