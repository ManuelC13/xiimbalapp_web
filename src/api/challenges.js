import { apiRequest } from '@/api/client'

export const getAdminChallenges = (params = {}) => {
  const query = new URLSearchParams()
  query.append('limit', params.limit ?? 500)
  if (params.badge_id) query.append('badge_id', params.badge_id)
  if (params.status) query.append('status_filter', params.status)
  return apiRequest(`/challenges/admin?${query.toString()}`)
}

export const createChallenge = (data) =>
  apiRequest('/challenges/', { method: 'POST', body: data })

export const updateChallenge = (id, data) =>
  apiRequest(`/challenges/${id}`, { method: 'PUT', body: data })

export const deleteChallenge = (id) =>
  apiRequest(`/challenges/${id}`, { method: 'DELETE' })

export const regenerateChallengeCode = (id) =>
  apiRequest(`/challenges/${id}/regenerate-code`, { method: 'POST' })