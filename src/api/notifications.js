import { apiRequest } from '@/api/client'

/**
 * Envía una notificación personalizada push
 * @param {Object} payload
 * @param {string} payload.title
 * @param {string} payload.body
 * @param {string} [payload.screen]
 * @param {Object} [payload.data]
 * @param {number[]} [payload.user_ids]
 */
export const sendCustomNotification = (payload) =>
  apiRequest('/api/admin/notification', {
    method: 'POST',
    body: payload,
  })

/**
 * Obtiene métricas del alcance de notificaciones (dispositivos, usuarios activos, plataformas).
 */
export const getNotificationStats = () =>
  apiRequest('/api/admin/notifications/stats')

/**
 * Obtiene el historial de notificaciones personalizadas enviadas.
 */
export const getNotificationHistory = (limit = 50) =>
  apiRequest(`/api/admin/notifications/history?limit=${limit}`)

/**
 * Dispara un recordatorio del sistema manualmente.
 * @param {'challenges' | 'platform-challenges' | 'inactivity' | 'favorites'} name
 * @param {number} [days]
 */
export const triggerReminder = (name, days) =>
  apiRequest(`/api/admin/notifications/reminders/${name}`, {
    method: 'POST',
    body: days ? { days } : {},
  })

/**
 * Obtiene la lista de usuarios para seleccionar destinatarios.
 */
export const getAdminUsers = (params = {}) => {
  const query = new URLSearchParams()
  query.append('skip', params.skip ?? 0)
  query.append('limit', params.limit ?? 200)
  if (params.only_active !== undefined) query.append('only_active', params.only_active)
  return apiRequest(`/api/admin/users?${query.toString()}`)
}
