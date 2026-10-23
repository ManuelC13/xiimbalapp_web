import { apiRequest } from '@/api/client'

export const login = (email, password) =>
  apiRequest('/api/auth/login', { method: 'POST', body: { email, password } }).then((data) => data.user)

export const getMe = () => apiRequest('/api/auth/me')

export const logout = () => apiRequest('/api/auth/logout', { method: 'POST' })
