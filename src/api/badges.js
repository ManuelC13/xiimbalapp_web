import { apiRequest } from '@/api/client'

export const getBadges = (params = {}) => {
  const query = new URLSearchParams()
  if (params.skip !== undefined) query.append('skip', params.skip)
  if (params.limit !== undefined) query.append('limit', params.limit)
  const qs = query.toString()
  return apiRequest(qs ? `/badges/?${qs}` : '/badges/')
}

export const getBadge = (id) => apiRequest(`/badges/${id}`)

export const createBadge = (data) =>
  apiRequest('/badges/', { method: 'POST', body: data })

export const updateBadge = (id, data) =>
  apiRequest(`/badges/${id}`, { method: 'PUT', body: data })

export const deleteBadge = (id) =>
  apiRequest(`/badges/${id}`, { method: 'DELETE' })

// Se usa para saber qué insignias están en uso
export const getChallenges = (params = {}) => {
  const query = new URLSearchParams()
  query.append('limit', params.limit ?? 500)
  return apiRequest(`/challenges/?${query.toString()}`)
}