import { apiRequest } from '@/api/client'

export const getPlaceTypes = () => apiRequest('/place-types/')