import {
  Users,
  Eye,
  Pencil,
  KeyRound,
  Trash2,
  Shield,
  MapPin,
  Award,
  Calendar,
  Compass,
  UserCheck,
  UserX,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import { resolveImageUrl } from '@/api/client'
import { getUserRole } from '@/hooks/admin/useUsersList'

function formatDate(isoString) {
  if (!isoString) return '—'
  try {
    const d = new Date(isoString)
    return d.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return isoString
  }
}

function getInitials(firstName, lastName) {
  return `${(firstName || '')[0] || ''}${(lastName || '')[0] || ''}`.toUpperCase() || 'U'
}

export default function UsersTable({
  users = [],
  loading = false,
  hasActiveFilters = false,
  onResetFilters,
  roles = [],
  currentAuthUser = null,
  onOpenDetail,
  onOpenEdit,
  onOpenPassword,
  onToggleStatus,
  onDeleteUser,
}) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-2xl bg-amber-100/60" />
        ))}
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-amber-950/20 bg-white/60 p-12 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-900">
          <Users className="size-7" />
        </div>
        <h3 className="mt-4 text-lg font-bold text-amber-950">No se encontraron usuarios</h3>
        <p className="mt-1 text-sm text-gris-600">
          {hasActiveFilters
            ? 'Prueba ajustando los términos de búsqueda o los filtros seleccionados.'
            : 'Aún no hay usuarios registrados en el sistema.'}
        </p>
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={onResetFilters} className="mt-4">
            Restablecer filtros
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-amber-950/10 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-amber-950/10 bg-amber-100/40 text-xs font-bold uppercase tracking-wider text-amber-950">
              <th className="px-6 py-4">Usuario</th>
              <th className="px-6 py-4">Correo Electrónico</th>
              <th className="px-6 py-4">Rol</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4 text-center">Actividad</th>
              <th className="px-6 py-4">Registro</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-950/5">
            {users.map((user) => {
              const { roleName, isAdmin: isUserAdmin } = getUserRole(
                user,
                roles,
                currentAuthUser
              )
              const avatarSrc = resolveImageUrl(user.profile_picture_url)

              return (
                <tr
                  key={user.user_id}
                  className="transition hover:bg-amber-50/60 group"
                >
                  {/* Usuario */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {avatarSrc ? (
                        <img
                          src={avatarSrc}
                          alt=""
                          className="size-10 rounded-xl object-cover ring-1 ring-amber-950/10"
                        />
                      ) : (
                        <div className="flex size-10 items-center justify-center rounded-xl bg-amber-900 font-bold text-amber-100 shadow-xs">
                          {getInitials(user.first_name, user.last_name)}
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-amber-950 group-hover:text-amber-800">
                          {user.first_name} {user.last_name}
                        </div>
                        <span className="text-[11px] font-semibold text-gris-500">
                          ID #{user.user_id}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Correo */}
                  <td className="px-6 py-4">
                    <span className="font-medium text-gris-800">{user.email}</span>
                  </td>

                  {/* Rol */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                        isUserAdmin
                          ? 'bg-amber-950 text-white shadow-xs'
                          : 'border border-amber-950/15 bg-white text-amber-900'
                      }`}
                    >
                      {isUserAdmin ? (
                        <Shield className="size-3.5 text-amber-400" />
                      ) : (
                        <Compass className="size-3.5 text-amber-700" />
                      )}
                      {roleName}
                    </span>
                  </td>

                  {/* Estado */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        user.is_active
                          ? 'bg-emerald-100/80 text-emerald-900'
                          : 'bg-gris-100 text-gris-600'
                      }`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${
                          user.is_active ? 'bg-emerald-600' : 'bg-gris-400'
                        }`}
                      />
                      {user.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>

                  {/* Actividad */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3 text-xs">
                      <span
                        title="Lugares visitados"
                        className="inline-flex items-center gap-1 font-semibold text-amber-800"
                      >
                        <MapPin className="size-3.5 text-amber-600" />
                        {user.visits_count ?? 0}
                      </span>
                      <span
                        title="Insignias ganadas"
                        className="inline-flex items-center gap-1 font-semibold text-indigo-800"
                      >
                        <Award className="size-3.5 text-indigo-600" />
                        {user.badges_count ?? 0}
                      </span>
                    </div>
                  </td>

                  {/* Registro */}
                  <td className="px-6 py-4 text-xs text-gris-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="size-3.5 text-gris-400" />
                      {formatDate(user.created_at)}
                    </div>
                  </td>

                  {/* Acciones */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* Ver Detalle */}
                      <button
                        type="button"
                        title="Ver detalle del usuario"
                        onClick={() => onOpenDetail(user)}
                        className="rounded-lg p-1.5 text-amber-900 transition hover:bg-amber-100 cursor-pointer"
                      >
                        <Eye className="size-4" />
                      </button>

                      {/* Editar */}
                      <button
                        type="button"
                        title="Editar usuario"
                        onClick={() => onOpenEdit(user)}
                        className="rounded-lg p-1.5 text-amber-900 transition hover:bg-amber-100 cursor-pointer"
                      >
                        <Pencil className="size-4" />
                      </button>

                      {/* Cambiar Contraseña */}
                      <button
                        type="button"
                        title="Cambiar contraseña"
                        onClick={() => onOpenPassword(user)}
                        className="rounded-lg p-1.5 text-amber-900 transition hover:bg-amber-100 cursor-pointer"
                      >
                        <KeyRound className="size-4" />
                      </button>

                      {/* Alternar Activo/Inactivo */}
                      <button
                        type="button"
                        title={user.is_active ? 'Suspender cuenta' : 'Activar cuenta'}
                        onClick={() => onToggleStatus(user)}
                        className={`rounded-lg p-1.5 transition cursor-pointer ${
                          user.is_active
                            ? 'text-amber-700 hover:bg-amber-100 hover:text-amber-950'
                            : 'text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {user.is_active ? (
                          <UserX className="size-4" />
                        ) : (
                          <UserCheck className="size-4" />
                        )}
                      </button>

                      {/* Eliminar (Soft delete) */}
                      <button
                        type="button"
                        title="Dar de baja usuario"
                        onClick={() => onDeleteUser(user)}
                        className="rounded-lg p-1.5 text-gris-500 transition hover:bg-rose-100 hover:text-rose-700 cursor-pointer"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
