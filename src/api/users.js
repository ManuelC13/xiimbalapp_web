import { apiRequest } from '@/api/client'

/**
 * Obtiene la lista de usuarios para administración.
 * @param {Object} [params]
 * @param {number} [params.skip=0]
 * @param {number} [params.limit=100]
 * @param {number} [params.role_id]
 * @param {boolean} [params.only_active]
 */
export const getUsers = (params = {}) => {
  const query = new URLSearchParams()
  if (params.skip !== undefined) query.append('skip', params.skip)
  if (params.limit !== undefined) query.append('limit', params.limit)
  if (params.role_id !== undefined && params.role_id !== 'all') query.append('role_id', params.role_id)
  if (params.only_active !== undefined) query.append('only_active', params.only_active)
  
  const qs = query.toString()
  return apiRequest(`/api/admin/users${qs ? `?${qs}` : ''}`)
}

/**
 * Obtiene el detalle completo de un usuario por su ID.
 * @param {number} userId
 */
export const getUser = (userId) => apiRequest(`/api/admin/users/${userId}`)

/**
 * Actualiza los datos de un usuario (rol, nombre, apellido, correo, estado activo).
 * @param {number} userId
 * @param {Object} data
 */
export const updateUser = (userId, data) =>
  apiRequest(`/api/admin/users/${userId}`, {
    method: 'PUT',
    body: data,
  })

/**
 * Cambia la contraseña de un usuario desde la administración.
 * @param {number} userId
 * @param {string} newPassword
 */
export const changeUserPassword = (userId, newPassword) =>
  apiRequest(`/api/admin/users/${userId}/password`, {
    method: 'PUT',
    body: { new_password: newPassword },
  })

/**
 * Da de baja (soft delete / desactivación) a un usuario.
 * @param {number} userId
 */
export const deleteUser = (userId) =>
  apiRequest(`/api/admin/users/${userId}`, {
    method: 'DELETE',
  })

/**
 * Obtiene el catálogo de roles disponibles.
 */
export const getRoles = () => apiRequest('/roles/')
