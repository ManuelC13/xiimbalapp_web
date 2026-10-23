import { apiRequest, resolveImageUrl } from '@/api/client'

export { resolveImageUrl }

export const getPlaces = (params = {}) => {
  const query = new URLSearchParams()
  if (params.skip !== undefined) query.append('skip', params.skip)
  if (params.limit !== undefined) query.append('limit', params.limit)
  if (params.magical_town_id !== undefined && params.magical_town_id !== null) {
    query.append('magical_town_id', params.magical_town_id)
  }
  if (params.category_id !== undefined && params.category_id !== null) {
    query.append('category_id', params.category_id)
  }
  if (params.search) query.append('search', params.search)
  if (params.only_active !== undefined) query.append('only_active', params.only_active)
  const qs = query.toString()
  return apiRequest(qs ? `/places/?${qs}` : '/places/')
}

export const getPlace = (id) => apiRequest(`/places/${id}`)

export const createPlace = (data) =>
  apiRequest('/places/', { method: 'POST', body: data })

export const updatePlace = (id, data) =>
  apiRequest(`/places/${id}`, { method: 'PUT', body: data })

export const deletePlace = (id) =>
  apiRequest(`/places/${id}`, { method: 'DELETE' })

// Imágenes del lugar
export const getPlaceImages = (placeId) =>
  apiRequest(`/place-images/by-place/${placeId}`)

export const addPlaceImage = (placeId, imageUrl) =>
  apiRequest('/place-images/', {
    method: 'POST',
    body: { place_id: placeId, image_url: imageUrl },
  })

export const uploadPlaceImage = (placeId, file) => {
  const formData = new FormData()
  formData.append('file', file)
  return apiRequest(`/place-images/upload/${placeId}`, {
    method: 'POST',
    body: formData,
  })
}

export const uploadImageFile = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return apiRequest('/place-images/upload-file', {
    method: 'POST',
    body: formData,
  })
}

export const deletePlaceImage = (imageId) =>
  apiRequest(`/place-images/${imageId}`, { method: 'DELETE' })

// Categorías
export const updatePlaceCategories = (placeId, categoryIds) =>
  apiRequest(`/places/${placeId}/categories`, {
    method: 'PUT',
    body: categoryIds,
  })

export { getCategories } from '@/api/categories'
