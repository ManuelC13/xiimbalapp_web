const API_URL = import.meta.env.DEV
  ? ''
  : (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/+$/, '')

const NO_REFRESH = ['/api/auth/login', '/api/auth/refresh', '/api/auth/logout']

let refreshing = null
function refreshSession() {
  refreshing ??= fetch(`${API_URL}/api/auth/refresh`, { method: 'POST', credentials: 'include' })
    .then((response) => response.ok)
    .catch(() => false)
    .finally(() => { refreshing = null })
  return refreshing
}

export async function apiRequest(endpoint, { body, headers = {}, ...options } = {}) {
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData
  const resolvedHeaders = isFormData
    ? { ...headers }
    : { 'Content-Type': 'application/json', ...headers }

  const send = () =>
    fetch(`${API_URL}${endpoint}`, {
      credentials: 'include',
      ...options,
      headers: resolvedHeaders,
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    })

  let response = await send()
  if (response.status === 401 && !NO_REFRESH.includes(endpoint) && (await refreshSession())) {
    response = await send()
  }

  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(typeof data?.detail === 'string' ? data.detail : `Error ${response.status}`)
  }
  return data
}

export function resolveImageUrl(url) {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  const base = import.meta.env.DEV
    ? ''
    : (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')
  return `${base}${url}`
}