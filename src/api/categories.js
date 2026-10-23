import { apiRequest } from '@/api/client'

export const getCategories = (params = {}) => {
  const query = new URLSearchParams()
  if (params.skip !== undefined) query.append('skip', params.skip)
  if (params.limit !== undefined) query.append('limit', params.limit)
  if (params.place_type_id !== undefined && params.place_type_id !== null) {
    query.append('place_type_id', params.place_type_id)
  }
  const qs = query.toString()
  return apiRequest(qs ? `/categories/?${qs}` : '/categories/')
}

export const getCategory = (id) => apiRequest(`/categories/${id}`)

export const createCategory = (data) =>
  apiRequest('/categories/', { method: 'POST', body: data })

export const updateCategory = (id, data) =>
  apiRequest(`/categories/${id}`, { method: 'PUT', body: data })

export const deleteCategory = (id) =>
  apiRequest(`/categories/${id}`, { method: 'DELETE' })