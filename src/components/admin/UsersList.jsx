import { Check, AlertCircle } from 'lucide-react'
import ConfirmModal from '@/components/admin/ConfirmModal'
import { useUsersList } from '@/hooks/admin/useUsersList'
import {
  UserHeader,
  UserFilters,
  UsersTable,
  UserDetailModal,
  UserEditModal,
  UserPasswordModal,
} from './users'

export default function UsersList() {
  const {
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
    refreshUsers,

    detailUser,
    detailLoading,
    handleOpenDetail,
    handleCloseDetail,

    editUser,
    setEditUser,
    handleSaveEdit,

    passwordUser,
    setPasswordUser,
    handleSavePassword,

    userToToggle,
    setUserToToggle,
    handleConfirmToggleStatus,

    userToDelete,
    setUserToDelete,
    handleConfirmDelete,

    actionLoading,
  } = useUsersList()

  const hasActiveFilters = Boolean(search.trim()) || roleFilter !== 'all' || statusFilter !== 'all'

  const resetFilters = () => {
    setSearch('')
    setRoleFilter('all')
    setStatusFilter('all')
  }

  return (
    <div className="space-y-8">
      {/* 1. Encabezado con métricas compactas */}
      <UserHeader
        stats={stats}
        loading={loading}
        onRefresh={refreshUsers}
      />

      {/* Banner de Feedback (Éxito o Error de acciones) */}
      {feedback && (
        <div
          className={`flex items-center gap-3 rounded-2xl p-4 text-sm font-semibold shadow-xs ${
            feedback.type === 'success'
              ? 'border border-emerald-300 bg-emerald-50 text-emerald-900'
              : 'border border-red-300 bg-red-50 text-red-900'
          }`}
        >
          {feedback.type === 'success' ? (
            <Check className="size-5 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="size-5 shrink-0 text-red-600" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-border-error bg-background-error p-4 text-sm text-error">
          {error}
        </div>
      )}

      {/* 2. Buscador y Filtros por píldora */}
      <UserFilters
        search={search}
        setSearch={setSearch}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        roles={roles}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={resetFilters}
      />

      {/* Contador de resultados */}
      <div className="flex items-center justify-between px-2 text-xs text-gris-600">
        <span>
          Mostrando <strong className="text-amber-950">{filteredUsers.length}</strong> de{' '}
          <strong>{stats.total}</strong> usuarios
        </span>
      </div>

      {/* 3. Tabla principal de usuarios */}
      <UsersTable
        users={filteredUsers}
        loading={loading}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={resetFilters}
        roles={roles}
        currentAuthUser={currentAuthUser}
        onOpenDetail={handleOpenDetail}
        onOpenEdit={(user) => setEditUser(user)}
        onOpenPassword={(user) => setPasswordUser(user)}
        onToggleStatus={(user) => setUserToToggle(user)}
        onDeleteUser={(user) => setUserToDelete(user)}
      />

      {/* 4. Modales de Gestión */}
      <UserDetailModal
        user={detailUser}
        roles={roles}
        currentAuthUser={currentAuthUser}
        loading={detailLoading}
        onClose={handleCloseDetail}
        onOpenEdit={(user) => setEditUser(user)}
        onOpenPassword={(user) => setPasswordUser(user)}
        onToggleStatus={(user) => setUserToToggle(user)}
      />

      <UserEditModal
        user={editUser}
        roles={roles}
        loading={actionLoading}
        onClose={() => setEditUser(null)}
        onSave={handleSaveEdit}
      />

      <UserPasswordModal
        user={passwordUser}
        loading={actionLoading}
        onClose={() => setPasswordUser(null)}
        onSave={handleSavePassword}
      />

      {/* Confirmar Cambio de Estado (Activar / Suspender) */}
      <ConfirmModal
        isOpen={Boolean(userToToggle)}
        title={
          userToToggle?.is_active
            ? '¿Suspender cuenta de usuario?'
            : '¿Reactivar cuenta de usuario?'
        }
        message={
          userToToggle?.is_active
            ? `¿Deseas suspender a ${userToToggle?.first_name} ${userToToggle?.last_name}? El usuario no podrá iniciar sesión en la aplicación móvil ni en la web.`
            : `¿Deseas activar la cuenta de ${userToToggle?.first_name} ${userToToggle?.last_name}? Podrá volver a iniciar sesión con normalidad.`
        }
        confirmText={userToToggle?.is_active ? 'Suspender' : 'Activar'}
        loading={actionLoading}
        onClose={() => setUserToToggle(null)}
        onConfirm={handleConfirmToggleStatus}
      />

      {/* Confirmar Eliminación (Soft Delete) */}
      <ConfirmModal
        isOpen={Boolean(userToDelete)}
        title="¿Dar de baja a este usuario?"
        message={`Esta acción dará de baja la cuenta de ${userToDelete?.first_name} ${userToDelete?.last_name} (${userToDelete?.email}). Su historial de visitas y retos se conservará para auditoría.`}
        confirmText="Dar de baja"
        loading={actionLoading}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
