import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  getUsers,
  getUser,
  updateUser,
  changeUserPassword,
  deleteUser,
  getRoles,
} from '@/api/users'
import { useAuthStore } from '@/store/authStore'

export function getUserRole(user, roles = [], currentAuthUser = null) {
  if (!user) return { roleName: 'Turista', isAdmin: false }

  // 1. Si el usuario ya trae su role_name explícito y no vacío
  if (user.role_name && typeof user.role_name === 'string' && user.role_name.trim()) {
    const isAdm = user.role_name.toLowerCase().includes('admin')
    return { roleName: user.role_name, isAdmin: isAdm }
  }

  // 2. Si es el usuario logueado actualmente (sabemos que es Admin)
  if (
    currentAuthUser &&
    (currentAuthUser.user_id === user.user_id || currentAuthUser.email === user.email)
  ) {
    return {
      roleName: currentAuthUser.role_name || 'Admin',
      isAdmin: true,
    }
  }

  // 3. Buscar en el catálogo de roles por su role_id
  const matchingRole = roles.find((r) => Number(r.role_id) === Number(user.role_id))
  if (matchingRole?.role_name) {
    const isAdm = matchingRole.role_name.toLowerCase().includes('admin')
    return { roleName: matchingRole.role_name, isAdmin: isAdm }
  }

  // 4. Si el usuario logueado tiene role_id, comparar con el role_id de este usuario
  if (currentAuthUser?.role_id && Number(user.role_id) === Number(currentAuthUser.role_id)) {
    return {
      roleName: currentAuthUser.role_name || 'Admin',
      isAdmin: true,
    }
  }

  // 5. Fallback estándar
  return {
    roleName: 'Turista',
    isAdmin: false,
  }
}

export function useUsersList() {
  const currentAuthUser = useAuthStore((s) => s.user)
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [feedback, setFeedback] = useState(null) // { type: 'success' | 'error', text: '' }

  // Filtros
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all') // 'all' | 'active' | 'inactive'

  // Modales
  const [detailUser, setDetailUser] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)

  const [editUser, setEditUser] = useState(null)
  const [passwordUser, setPasswordUser] = useState(null)
  const [userToToggle, setUserToToggle] = useState(null)
  const [userToDelete, setUserToDelete] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [usersData, rolesData] = await Promise.all([
        getUsers({ limit: 200 }),
        getRoles().catch(() => []),
      ])

      const validRoles = Array.isArray(rolesData) ? rolesData : []
      const roleMap = new Map(validRoles.map((r) => [Number(r.role_id), r.role_name]))

      const enrichedUsers = (Array.isArray(usersData) ? usersData : []).map((u) => {
        const { roleName } = getUserRole(u, validRoles, currentAuthUser)
        return {
          ...u,
          role_name: roleName,
        }
      })

      setUsers(enrichedUsers)
      setRoles(validRoles)
    } catch (err) {
      setError(err.message || 'Error al cargar los usuarios.')
    } finally {
      setLoading(false)
    }
  }, [currentAuthUser])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Ver detalle
  const handleOpenDetail = async (user) => {
    setDetailUser(user)
    setDetailLoading(true)
    try {
      const detailed = await getUser(user.user_id)
      const { roleName } = getUserRole(detailed, roles, currentAuthUser)
      setDetailUser({ ...detailed, role_name: roleName })
    } catch {
      // Si falla obtener conteos detallados, nos quedamos con el objeto base
    } finally {
      setDetailLoading(false)
    }
  }

  const handleCloseDetail = () => {
    setDetailUser(null)
  }

  // Guardar edición
  const handleSaveEdit = async (formData) => {
    if (!editUser) return
    setActionLoading(true)
    try {
      const updated = await updateUser(editUser.user_id, formData)
      const { roleName } = getUserRole(updated, roles, currentAuthUser)
      const finalUpdated = { ...updated, role_name: roleName }

      setUsers((prev) =>
        prev.map((u) => (u.user_id === finalUpdated.user_id ? { ...u, ...finalUpdated } : u))
      )
      if (detailUser?.user_id === finalUpdated.user_id) {
        setDetailUser((prev) => ({ ...prev, ...finalUpdated }))
      }
      setEditUser(null)
      showFeedback('success', 'Usuario actualizado exitosamente.')
    } catch (err) {
      showFeedback('error', err.message || 'Error al actualizar usuario.')
    } finally {
      setActionLoading(false)
    }
  }

  // Cambiar contraseña
  const handleSavePassword = async (newPassword) => {
    if (!passwordUser) return
    setActionLoading(true)
    try {
      await changeUserPassword(passwordUser.user_id, newPassword)
      setPasswordUser(null)
      showFeedback('success', 'Contraseña actualizada con éxito.')
    } catch (err) {
      showFeedback('error', err.message || 'Error al cambiar la contraseña.')
    } finally {
      setActionLoading(false)
    }
  }

  // Activar / Desactivar
  const handleConfirmToggleStatus = async () => {
    if (!userToToggle) return
    setActionLoading(true)
    try {
      const nextStatus = !userToToggle.is_active
      const updated = await updateUser(userToToggle.user_id, { is_active: nextStatus })
      const { roleName } = getUserRole(updated, roles, currentAuthUser)
      const finalUpdated = { ...updated, role_name: roleName }

      setUsers((prev) =>
        prev.map((u) => (u.user_id === finalUpdated.user_id ? { ...u, ...finalUpdated } : u))
      )
      if (detailUser?.user_id === finalUpdated.user_id) {
        setDetailUser((prev) => ({ ...prev, ...finalUpdated }))
      }
      setUserToToggle(null)
      showFeedback(
        'success',
        nextStatus ? 'Usuario activado exitosamente.' : 'Usuario suspendido/desactivado exitosamente.'
      )
    } catch (err) {
      showFeedback('error', err.message || 'Error al cambiar el estado del usuario.')
    } finally {
      setActionLoading(false)
    }
  }

  // Eliminar (soft-delete)
  const handleConfirmDelete = async () => {
    if (!userToDelete) return
    setActionLoading(true)
    try {
      await deleteUser(userToDelete.user_id)
      setUsers((prev) => prev.filter((u) => u.user_id !== userToDelete.user_id))
      if (detailUser?.user_id === userToDelete.user_id) {
        setDetailUser(null)
      }
      setUserToDelete(null)
      showFeedback('success', 'Usuario dado de baja del sistema.')
    } catch (err) {
      showFeedback('error', err.message || 'Error al eliminar usuario.')
    } finally {
      setActionLoading(false)
    }
  }

  const showFeedback = (type, text) => {
    setFeedback({ type, text })
    setTimeout(() => setFeedback(null), 4500)
  }

  // Métricas
  const stats = useMemo(() => {
    const total = users.length
    const active = users.filter((u) => u.is_active).length
    const inactive = total - active
    const admins = users.filter((u) => {
      const { isAdmin } = getUserRole(u, roles, currentAuthUser)
      return isAdmin
    }).length
    return { total, active, inactive, admins }
  }, [users, roles, currentAuthUser])

  // Filtrado
  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase()
    return users.filter((user) => {
      // Filtro de búsqueda
      if (q) {
        const fullName = `${user.first_name} ${user.last_name}`.toLowerCase()
        const matchesName = fullName.includes(q)
        const matchesEmail = user.email.toLowerCase().includes(q)
        const matchesId = String(user.user_id).includes(q)
        if (!matchesName && !matchesEmail && !matchesId) return false
      }

      // Filtro por rol
      if (roleFilter !== 'all') {
        if (Number(user.role_id) !== Number(roleFilter)) return false
      }

      // Filtro por estado
      if (statusFilter === 'active' && !user.is_active) return false
      if (statusFilter === 'inactive' && user.is_active) return false

      return true
    })
  }, [users, search, roleFilter, statusFilter])

  return {
    users,
    roles,
    currentAuthUser,
    loading,
    error,
    feedback,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    stats,
    filteredUsers,
    refreshUsers: loadData,

    // Detalle
    detailUser,
    detailLoading,
    handleOpenDetail,
    handleCloseDetail,

    // Edición
    editUser,
    setEditUser,
    handleSaveEdit,

    // Contraseña
    passwordUser,
    setPasswordUser,
    handleSavePassword,

    // Alternar estado
    userToToggle,
    setUserToToggle,
    handleConfirmToggleStatus,

    // Eliminar
    userToDelete,
    setUserToDelete,
    handleConfirmDelete,

    actionLoading,
  }
}
