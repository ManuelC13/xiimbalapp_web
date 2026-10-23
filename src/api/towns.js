import { apiRequest } from '@/api/client'

export const getMagicalTowns = (params = {}) => {
  const query = new URLSearchParams()
  if (params.skip !== undefined) query.append('skip', params.skip)
  if (params.limit !== undefined) query.append('limit', params.limit)
  const qs = query.toString()
  return apiRequest(qs ? `/magical-towns/?${qs}` : '/magical-towns/')
}

export const getMagicalTown = (id) => apiRequest(`/magical-towns/${id}`)

export const createMagicalTown = (data) =>
  apiRequest('/magical-towns/', { method: 'POST', body: data })

export const updateMagicalTown = (id, data) =>
  apiRequest(`/magical-towns/${id}`, { method: 'PUT', body: data })

export const deleteMagicalTown = (id) =>
  apiRequest(`/magical-towns/${id}`, { method: 'DELETE' })
