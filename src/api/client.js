const API_URL = import.meta.env.DEV
  ? ''
  : (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/+$/, '')

const NO_REFRESH = ['/api/auth/login', '/api/auth/refresh', '/api/auth/logout']

// Se ejecuta cuando la sesión ya no puede renovarse (refresh token inválido/expirado).
let sessionExpiredHandler = null
export function setSessionExpiredHandler(handler) {
  sessionExpiredHandler = handler
}

/**
 * Renueva el access_token usando la cookie refresh_token.
 * Las peticiones concurrentes comparten la misma promesa para no disparar varios refresh.
 * Resuelve `true` si la sesión se renovó.
 */
let refreshing = null
export function refreshSession() {
  refreshing ??= fetch(`${API_URL}/api/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    cache: 'no-store',
  })
    .then((response) => {
      if (!response.ok) console.warn(`[auth] No se pudo renovar la sesión (HTTP ${response.status})`)
      return response.ok
    })
    .catch((err) => {
      console.warn('[auth] Error de red al renovar la sesión', err)
      return false
    })
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
      cache: 'no-store',
      ...options,
      headers: resolvedHeaders,
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    })

  let response = await send()

  if (response.status === 401 && !NO_REFRESH.includes(endpoint)) {
    // Si hay otro refresh en curso (o recién terminado) se reutiliza.
    if (await refreshSession()) {
      response = await send()
    }
    // Si aun así sigue en 401, la sesión murió: avisar al store para cerrar sesión.
    if (response.status === 401) sessionExpiredHandler?.()
  }

  const data = await response.json().catch(() => null)
  if (!response.ok) {
    const error = new Error(typeof data?.detail === 'string' ? data.detail : `Error ${response.status}`)
    error.status = response.status
    throw error
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
